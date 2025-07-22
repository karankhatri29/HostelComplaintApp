import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Portal,
  Modal,
  TextInput,
  IconButton,
  Text,
  SegmentedButtons,
  Surface,
  Divider,
} from 'react-native-paper';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface CleaningRequest {
  id: string;
  studentName: string;
  roomNumber: string;
  requestType: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  remarks?: string;
}

interface CleanerDashboardProps {
  onLogout: () => void;
}

// Mock data for cleaning requests
const mockRequests: CleaningRequest[] = [
  {
    id: '1',
    studentName: 'John Doe',
    roomNumber: '201A',
    requestType: 'General Cleaning',
    description: 'Weekly room cleaning service required. Please focus on bathroom and study area.',
    status: 'pending',
    date: '2025-01-15',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    roomNumber: '305B',
    requestType: 'Deep Cleaning',
    description: 'Deep cleaning required after room renovation. All surfaces need thorough cleaning.',
    status: 'in-progress',
    date: '2025-01-14',
    remarks: 'Started cleaning, bathroom completed',
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    roomNumber: '102C',
    requestType: 'Window Cleaning',
    description: 'Windows are very dirty and need professional cleaning.',
    status: 'pending',
    date: '2025-01-13',
  },
  {
    id: '4',
    studentName: 'Sarah Wilson',
    roomNumber: '408A',
    requestType: 'Carpet Cleaning',
    description: 'Carpet has stains and needs specialized cleaning treatment.',
    status: 'completed',
    date: '2025-01-12',
    remarks: 'Completed carpet cleaning with stain removal treatment',
  },
];

export default function CleanerDashboard({ onLogout }: CleanerDashboardProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState<CleaningRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<CleaningRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [newRemarks, setNewRemarks] = useState('');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const inProgressRequests = requests.filter(r => r.status === 'in-progress');
  const completedRequests = requests.filter(r => r.status === 'completed');

  const handleViewDetails = (request: CleaningRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAddRemarks = (request: CleaningRequest) => {
    setSelectedRequest(request);
    setNewRemarks(request.remarks || '');
    setShowRemarksModal(true);
  };

  const handleEndRequest = (request: CleaningRequest) => {
    setRequests(requests.map(r =>
      r.id === request.id
        ? { ...r, status: 'completed' as const }
        : r
    ));
  };

  const handleStartRequest = (request: CleaningRequest) => {
    setRequests(requests.map(r =>
      r.id === request.id
        ? { ...r, status: 'in-progress' as const }
        : r
    ));
  };

  const saveRemarks = () => {
    if (!selectedRequest) return;

    setRequests(requests.map(r =>
      r.id === selectedRequest.id
        ? { ...r, remarks: newRemarks }
        : r
    ));

    setShowRemarksModal(false);
    setNewRemarks('');
    setSelectedRequest(null);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA726';
      case 'in-progress': return '#42A5F5';
      case 'completed': return '#66BB6A';
      default: return '#9E9E9E';
    }
  };

  const renderRequest = (request: CleaningRequest) => (
    <Card key={request.id} style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Title style={styles.requestTitle}>Room {request.roomNumber}</Title>
            <Text style={styles.studentName}>{request.studentName}</Text>         </View>
        </View>

        <Paragraph style={styles.description}>{request.description}</Paragraph>

        <View style={styles.statusContainer}>
          <Chip
            icon="clock-outline"
            textStyle={{ fontSize: 12, color: 'white' }}
            style={[styles.statusChip, { backgroundColor: getStatusColor(request.status) }]}
          >
            {request.status.toUpperCase()}
          </Chip>
          <Text style={styles.dateText}>{request.date}</Text>
        </View>

        {request.remarks && (
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksLabel}>Remarks:</Text>
            <Text style={styles.remarksText}>{request.remarks}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            icon="eye"
            onPress={() => handleViewDetails(request)}
            style={styles.actionButton}
            compact
          >
            View
          </Button>
          <Button
            mode="outlined"
            icon="comment-edit"
            onPress={() => handleAddRemarks(request)}
            style={styles.actionButton}
            compact
          >
            Remarks
          </Button>
          {request.status === 'pending' && (
            <Button
              mode="contained"
              icon="play"
              onPress={() => handleStartRequest(request)}
              style={[styles.actionButton,{ backgroundColor: '#4CAF50' }]}
              compact
            >
              Start
            </Button>
          )}
          {request.status === 'in-progress' && (
            <Button
              mode="contained"
              icon="check"
              onPress={() => handleEndRequest(request)}
              style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
              compact
            >
              Complete
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderSection = (title: string, requests: CleaningRequest[], icon: string) => (
    <View style={styles.section}>
      <Surface style={styles.sectionHeader}>
        <IconButton icon={icon} size={24} />
        <Title style={styles.sectionTitle}>{title} ({requests.length})</Title>
      </Surface>
      {requests.length > 0 ? (
        requests.map(renderRequest)
      ) : (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <IconButton icon={icon} size={40} iconColor="#9E9E9E" />
            <Paragraph>No {title.toLowerCase()} requests</Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Surface style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'pending',
                label: `Pending`,
                icon: 'clock-outline',
              },
              {
                value: 'inprogress',
                label: `Inprogress`,
                icon: 'clock-outline',
              },
              {
                value: 'completed',
                label: `Completed`,
                icon: 'check-circle',
              },
            ]}
            style={styles.segmentedButtons}
          />
        </Surface>
        {activeTab === 'pending' && renderSection('Pending Requests', pendingRequests, 'clock-outline')}
        {activeTab === 'inprogress' && renderSection('In Progress', inProgressRequests, 'progress-clock')}
        {activeTab === 'completed' && renderSection('Completed', completedRequests, 'check-circle')}
      </ScrollView>

      {/* Details Modal */}
      <Portal>
        <Modal
          visible={showDetailsModal}
          onDismiss={() => setShowDetailsModal(false)}
          contentContainerStyle={styles.modal}
        >
          {selectedRequest && (
            <>
              <Title style={styles.modalTitle}>Request Details</Title>
              <Divider style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Room:</Text>
                <Text style={styles.detailValue}>{selectedRequest.roomNumber}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Student:</Text>
                <Text style={styles.detailValue}>{selectedRequest.studentName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{selectedRequest.requestType}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Chip
                  style={[styles.detailChip, { backgroundColor: getStatusColor(selectedRequest.status) }]}
                  textStyle={{ color: 'white' }}
                >
                  {selectedRequest.status.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailDescription}>{selectedRequest.description}</Text>
              </View>

              {selectedRequest.remarks && (
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Remarks:</Text>
                  <Text style={styles.detailDescription}>{selectedRequest.remarks}</Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={() => setShowDetailsModal(false)}
                style={styles.modalCloseButton}
              >
                Close
              </Button>
            </>
          )}
        </Modal>
      </Portal>

      {/* Remarks Modal */}
      <Portal>
        <Modal
          visible={showRemarksModal}
          onDismiss={() => setShowRemarksModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Add Remarks</Title>

          <TextInput
            label="Remarks"
            value={newRemarks}
            onChangeText={setNewRemarks}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
            placeholder="Add your remarks about this cleaning request..."
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowRemarksModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={saveRemarks}
              style={styles.modalButton}
            >
              Save Remarks
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
  },
  requestCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusChip: {
    height: 28,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  remarksContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  remarksLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    borderStyle:'solid',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    gap: '14',
  },
  actionButton: {
    flex: isTablet ? 1 : undefined,
    paddingRight:2
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
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailColumn: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  detailChip: {
    height: 24,
  },
  detailDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  modalCloseButton: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    marginLeft: 8,
  },
});