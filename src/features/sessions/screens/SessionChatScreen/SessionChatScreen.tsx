/**
 * SessionChatScreen
 * Chat interface for communication with partners
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useGetChatMessages, useSendChatMessage, ChatMessage as DealerChatMessage } from '@services/api';
import { useAppSelector } from '@store/hooks';
import { ChatMessage as SessionChatMessage } from '../../@types';
import { SessionChatScreenRouteProp } from './@types';
import { createStyles } from './styles';

const SessionChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionChatScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const { sessionId, partnerId, partnerName, inquiryRef } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);

  const user = useAppSelector((state) => state.auth.user);

  const { data: chatData } = useGetChatMessages(sessionId || '');
  const { mutateAsync: sendChatMessage } = useSendChatMessage();

  useEffect(() => {
    if (!chatData?.messages) {
      return;
    }

    const mappedMessages: SessionChatMessage[] = chatData.messages.map(
      (msg: DealerChatMessage) => {
        const isUser = user ? msg.sender_id === user.user_id : false;

        const messageType: SessionChatMessage['messageType'] =
          msg.type === 'image'
            ? 'image'
            : msg.type === 'document'
            ? 'file'
            : 'text';

        return {
          id: String(msg.id),
          sessionId: String(msg.session_id),
          partnerId: isUser ? String(partnerId || '') : String(msg.sender_id),
          senderId: String(msg.sender_id),
          senderType: isUser ? 'user' : 'partner',
          senderName: isUser ? 'You' : msg.sender_name || partnerName || 'Partner',
          messageType,
          content: msg.message,
          isRead: msg.is_read,
          sentAt: msg.created_at,
        };
      }
    );

    setMessages(mappedMessages);
  }, [chatData, user, partnerId, partnerName]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleInfo = useCallback(() => {
    // TODO: Show session/partner info
  }, []);

  const handleAttach = useCallback(() => {
    // TODO: Open attachment picker
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;

    const text = message.trim();

    try {
      setMessage('');

      if (sessionId) {
        const response = await sendChatMessage({
          sessionId,
          data: {
            message: text,
            type: 'text',
          },
        });

        const sent = response.message as DealerChatMessage;
        const isUser = user ? sent.sender_id === user.user_id : true;

        const newMessage: SessionChatMessage = {
          id: String(sent.id),
          sessionId: String(sent.session_id),
          partnerId: isUser ? String(partnerId || '') : String(sent.sender_id),
          senderId: String(sent.sender_id),
          senderType: isUser ? 'user' : 'partner',
          senderName: isUser ? 'You' : sent.sender_name || partnerName || 'Partner',
          messageType: 'text',
          content: sent.message,
          isRead: sent.is_read,
          sentAt: sent.created_at,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Failed to send message', error);
      setMessage(text);
    }
  }, [message, sessionId, partnerId, partnerName, sendChatMessage, user]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = (msg: SessionChatMessage, index: number) => {
    const isUser = msg.senderType === 'user';
    const showAvatar = !isUser && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);

    return (
      <View key={msg.id}>
        <View style={[styles.messageRow, isUser ? styles.messageRowSent : styles.messageRowReceived]}>
          {!isUser && (
            <View style={[styles.avatarPlaceholder, !showAvatar && styles.avatarHidden]}>
              <AppIcon.Person width={16} height={16} color={theme.colors.text.tertiary} />
            </View>
          )}

          <View style={styles.messageContent}>
            {!isUser && showAvatar && (
              <Text style={styles.messageMeta}>
                {msg.senderName} • {formatTime(msg.sentAt)}
              </Text>
            )}
            {isUser && (
              <Text style={[styles.messageMeta, styles.messageMetaSent]}>
                {msg.senderName} • {formatTime(msg.sentAt)}
              </Text>
            )}

            {msg.messageType === 'text' && (
              <>
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.messageBubbleSent : styles.messageBubbleReceived,
                  ]}
                >
                  <Text style={[styles.messageText, isUser ? styles.messageTextSent : styles.messageTextReceived]}>
                    {msg.content}
                  </Text>
                </View>
                {isUser && <Text style={styles.messageStatus}>{msg.isRead ? 'Read' : 'Sent'}</Text>}
              </>
            )}

            {msg.messageType === 'file' && (
              <View style={styles.fileMessage}>
                <View style={styles.fileIcon}>
                  <AppIcon.Market width={20} height={20} color={theme.colors.primary.DEFAULT} />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{msg.fileName}</Text>
                  <Text style={styles.fileSize}>{msg.fileSize} • {msg.fileType}</Text>
                </View>
                <TouchableOpacity>
                  <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.tertiary} style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
              </View>
            )}

            {msg.messageType === 'image' && (
              <View style={styles.imageMessage}>
                <View style={styles.imagePreview}>
                  <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary, justifyContent: 'center', alignItems: 'center' }}>
                    <AppIcon.Market width={40} height={40} color={theme.colors.text.tertiary} />
                  </View>
                </View>
                <View style={styles.imageFooter}>
                  <Text style={styles.imageFileName}>{msg.fileName}</Text>
                  <AppIcon.EyeOn width={16} height={16} color={theme.colors.text.tertiary} />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.primary}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AppIcon.ArrowLeft width={22} height={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{partnerName || 'Partner'}</Text>
            <Text style={styles.headerSubtitle}>{inquiryRef || 'Session Chat'}</Text>
          </View>
          <TouchableOpacity style={styles.infoButton} onPress={handleInfo}>
            <AppIcon.Warning width={20} height={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {/* Date Separator */}
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>Today</Text>
          </View>

          {/* Messages */}
          {messages.map((msg, index) => renderMessage(msg, index))}
        </ScrollView>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Finalize deals offline. Agreements made here are for negotiation purposes only.
          </Text>
        </View>

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + theme.spacing[2] }]}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton} onPress={handleAttach}>
              <AppIcon.ArrowRight width={22} height={22} color={theme.colors.text.tertiary} style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <AppIcon.ArrowRight width={18} height={18} color="#FFFFFF" style={{ transform: [{ rotate: '-45deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default SessionChatScreen;
