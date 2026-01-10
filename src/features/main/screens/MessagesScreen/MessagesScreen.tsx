import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';

interface Message {
  id: string;
  senderName: string;
  senderCompany: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderName: 'Rahul Sharma',
    senderCompany: 'Apex Industries',
    lastMessage: 'Sure, I can deliver the materials by Friday...',
    time: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    senderName: 'Priya Patel',
    senderCompany: 'EcoWraps Ltd.',
    lastMessage: 'Can you share the specifications?',
    time: '15m ago',
    unread: 0,
  },
  {
    id: '3',
    senderName: 'Amit Kumar',
    senderCompany: 'TechPack Solutions',
    lastMessage: 'Quote accepted. Please proceed.',
    time: '1h ago',
    unread: 1,
  },
  {
    id: '4',
    senderName: 'Sneha Reddy',
    senderCompany: 'FlexiFilm Corp',
    lastMessage: 'The order has been dispatched.',
    time: '3h ago',
    unread: 0,
  },
];

const MessagesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity style={styles.messageCard} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.senderName.charAt(0)}</Text>
        </View>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.senderName}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <Text style={styles.senderCompany}>{item.senderCompany}</Text>
        <Text 
          style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <AppIcon.Search width={24} height={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={mockMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  messageCard: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F46E5',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  senderCompany: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  lastMessageUnread: {
    color: '#374151',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default MessagesScreen;
