import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
  List,
  IconButton,
  Text,
  Surface,
} from 'react-native-paper';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'complaint' | 'repair';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  date: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

interface StudentDashboardProps {
  onLogout: () => void;
}

// Mock data for complaints
const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'AC not working',
    description: 'The air conditioning unit in room 201 is not cooling properly',
    category: 'repair',
    status: 'pending',
    date: '2025-01-15',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Room cleaning needed',
    description: 'Weekly room cleaning service required',
    category: 'complaint',
    status: 'in-progress',
    date: '2025-01-14',
    priority: 'medium',
    assignedTo: 'Cleaner Team A',
  },
  {
    id: '3',
    title: 'WiFi connectivity issues',
    description: 'Internet connection is unstable in the common area',
    category: 'complaint',
    status: 'resolved',
    date: '2025-01-12',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Light bulb replacement',
    description: 'Ceiling light in bathroom needs replacement',
    category: 'repair',
    status: 'rejected',
    date: '2025-01-10',
    priority: 'low',
  },
];

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [newComplaintType, setNewComplaintType] = useState<'complaint' | 'repair'>('complaint');
  const [newComplaintTitle, setNewComplaintTitle] = useState('');
  const [newComplaintDescription, setNewComplaintDescription] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'in-progress');
  const historyComplaints = complaints.filter(c => c.status === 'resolved' || c.status === 'rejected');

  const handleNewComplaint = (type: 'complaint' | 'repair') => {
    setNewComplaintType(type);
    setShowNewComplaintModal(true);
  };

  const submitComplaint = () => {
    if (!newComplaintTitle.trim() || !newComplaintDescription.trim()) return;

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      title: newComplaintTitle,
      description: newComplaintDescription,
      category: newComplaintType,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
    };

    setComplaints([newComplaint, ...complaints]);
    setNewComplaintTitle('');
    setNewComplaintDescription('');
    setShowNewComplaintModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA726';
      case 'in-progress': return '#42A5F5';
      case 'resolved': return '#66BB6A';
      case 'rejected': return '#EF5350';
      default: return '#9E9E9E';
    }
  };

  

  const renderComplaint = (complaint: Complaint) => (
    <Card key={complaint.id} style={styles.complaintCard}>
      <Card.Content>
        <View style={styles.complaintHeader}>
          <Title style={styles.complaintTitle}>{complaint.title}</Title>
          <Chip 
            icon={complaint.category === 'repair' ? 'wrench' : 'alert-circle'}
            textStyle={{ color: 'white', fontSize: 12 }}
            style={[styles.categoryChip, {backgroundColor: '#cdb1ffff'}]}
          >
            {complaint.category.toUpperCase()}
          </Chip>
        </View>
        
        <Paragraph style={styles.complaintDescription}>{complaint.description}</Paragraph>
        
        <View style={styles.complaintFooter}>
          <View style={styles.complaintMeta}>
            <Chip 
              icon="clock-outline"
              textStyle={{ fontSize: 12 }}
              style={[styles.statusChip, { backgroundColor: getStatusColor(complaint.status) }]}
            >
              {complaint.status.toUpperCase()}
            </Chip>
          </View>
          <Text style={styles.dateText}>{complaint.date}</Text>
        </View>
        
        {complaint.assignedTo && (
          <Text style={styles.assignedText}>Assigned to: {complaint.assignedTo}</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Action Buttons */}
        <Surface style={styles.actionButtonsContainer}>
          <View style={isTablet ? styles.actionButtonsRowTablet : styles.actionButtonsRow}>
            <Button
              mode="contained"
              icon="plus-circle"
              onPress={() => handleNewComplaint('complaint')}
              style={[styles.actionButton, { backgroundColor: '#226fffff' }]}
              contentStyle={styles.actionButtonContent}
            >
              New Complaints
            </Button>
            <Button
              mode="contained"
              icon="wrench"
              onPress={() => handleNewComplaint('repair')}
              style={[styles.actionButton, { backgroundColor: '#673AB7' }]}
              contentStyle={styles.actionButtonContent}
            >
              Room Repairs
            </Button>
          </View>
        </Surface>

        {/* Tab Navigation */}
        <Surface style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'pending',
                label: `Pending (${pendingComplaints.length})`,
                icon: 'clock-outline',
              },
              {
                value: 'history',
                label: `History (${historyComplaints.length})`,
                icon: 'history',
              },
            ]}
            style={styles.segmentedButtons}
          />
        </Surface>

        {/* Complaints List */}
        <View style={styles.complaintsContainer}>
          {activeTab === 'pending' ? (
            pendingComplaints.length > 0 ? (
              pendingComplaints.map(renderComplaint)
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <IconButton icon="check-circle" size={60} iconColor="#4CAF50" />
                  <Title>No Pending Complaints</Title>
                  <Paragraph>All your complaints have been resolved!</Paragraph>
                </Card.Content>
              </Card>
            )
          ) : (
            historyComplaints.length > 0 ? (
              historyComplaints.map(renderComplaint)
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <IconButton icon="history" size={60} iconColor="#9E9E9E" />
                  <Title>No History</Title>
                  <Paragraph>You haven't submitted any complaints yet.</Paragraph>
                </Card.Content>
              </Card>
            )
          )}
        </View>
      </ScrollView>

      {/* New Complaint Modal */}
      <Portal>
        <Modal
          visible={showNewComplaintModal}
          onDismiss={() => setShowNewComplaintModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>
            New {newComplaintType === 'repair' ? 'Repair Request' : 'Complaint'}
          </Title>
          
          <TextInput
            label="Title"
            value={newComplaintTitle}
            onChangeText={setNewComplaintTitle}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Description"
            value={newComplaintDescription}
            onChangeText={setNewComplaintDescription}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />
          
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowNewComplaintModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={submitComplaint}
              style={styles.modalButton}
              disabled={!newComplaintTitle.trim() || !newComplaintDescription.trim()}
            >
              Submit
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  actionButtonsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  actionButtonsRow: {
    flexDirection: 'column',
    gap: 12,
  },
  actionButtonsRowTablet: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: isTablet ? 1 : undefined,
    borderRadius: 8,
  },
  actionButtonContent: {
    paddingVertical: 8,
    fontSize: 12,
  },
  tabContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 1,
  },
  segmentedButtons: {
    margin: 16,
  },
  complaintsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  complaintCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  complaintTitle: {
    flex: 1,
    fontSize: 18,
    marginRight: 12,
  },
  categoryChip: {
    height: 28,
  },
  complaintDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    height: 28,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  assignedText: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#4CAF50',
  },
  emptyCard: {
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});