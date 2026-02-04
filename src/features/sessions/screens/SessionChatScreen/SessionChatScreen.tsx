/**
 * SessionChatScreen
 * Chat interface for communication with partners
 */

import React, { useState, useCallback, useRef } from 'react';
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
import { ChatMessage } from '../../@types';
import { SessionChatScreenRouteProp } from './@types';
import { createStyles } from './styles';

// Mock messages
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sessionId: '1',
    partnerId: 'sup-001',
    senderId: 'sup-001',
    senderType: 'partner',
    senderName: 'EcoPack Solutions',
    messageType: 'text',
    content: 'Hello, I have attached the material specifications for the polymer request. Let me know if you need any adjustments.',
    isRead: true,
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  // {
  //   id: '2',
  //   sessionId: '1',
  //   partnerId: 'sup-001',
  //   senderId: 'sup-001',
  //   senderType: 'partner',
  //   senderName: 'EcoPack Solutions',
  //   messageType: 'file',
  //   content: '',
  //   fileName: 'Material_Specs.pdf',
  //   fileSize: '2.4 MB',
  //   fileType: 'PDF',
  //   isRead: true,
  //   sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 30000).toISOString(),
  // },
  {
    id: '3',
    sessionId: '1',
    partnerId: 'sup-001',
    senderId: 'user-001',
    senderType: 'user',
    senderName: 'Global Logistics Co.',
    messageType: 'text',
    content: 'Received, thank you. Checking the tensile strength requirements now. Could you also share the bulk pricing for Q3?',
    isRead: true,
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  // {
  //   id: '4',
  //   sessionId: '1',
  //   partnerId: 'sup-001',
  //   senderId: 'sup-001',
  //   senderType: 'partner',
  //   senderName: 'EcoPack Solutions',
  //   messageType: 'image',
  //   content: '',
  //   fileName: 'Bulk_Pricing_Q3.jpg',
  //   isRead: true,
  //   sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  // },
];

const SessionChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<SessionChatScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const { sessionId, partnerId, partnerName, inquiryRef } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleInfo = useCallback(() => {
    // TODO: Show session/partner info
  }, []);

  const handleAttach = useCallback(() => {
    // TODO: Open attachment picker
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sessionId: sessionId || '',
      partnerId: partnerId || '',
      senderId: 'user-001',
      senderType: 'user',
      senderName: 'You',
      messageType: 'text',
      content: message.trim(),
      isRead: false,
      sentAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [message, sessionId, partnerId]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
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
