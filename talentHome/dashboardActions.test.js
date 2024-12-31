import { render, screen, fireEvent } from '@testing-library/react';
import DashboardActions from './index'; 
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; 

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('DashboardActions Component', () => {
  let mockSetShowUploadResumeModal;
  let mockShowTaskDetailsModal;

  const mockHistoryPush = jest.fn();

  beforeEach(() => {
    mockSetShowUploadResumeModal = jest.fn();
    mockShowTaskDetailsModal = jest.fn();

    render(
      <MemoryRouter>
        <DashboardActions
          fetching={false}
          memberList={['Member 1']}
          userData={{ agencyInstrId: 1 }}
          projectActions={[]}
          legalDocumentActions={[]}
          acceptTravelFee={[]}
          resumeAlert={[]}
          paymentAlert={[]}
          currentInstrID="all"
          yellowWarning="/path/to/yellowWarning.png"
          greenTick="/path/to/greenTick.png"
          history={{ push: mockHistoryPush }}
          setShowUploadResumeModal={mockSetShowUploadResumeModal}
          showTaskDetailsModal={mockShowTaskDetailsModal}
        />
      </MemoryRouter>
    );
  });

  it('should render the component with the "Actions Required" label', () => {
    expect(screen.getByText(/Actions Required/i)).toBeInTheDocument();
  });

  it('should show "Add Members To Your Agency" alert when memberList is less than 2 and agencyInstrId is greater than 0', () => {
    const alert = screen.getByText(/Add Members To Your Agency/i);
    expect(alert).toBeInTheDocument();
  });

  it('should call history.push when clicking on "Add Members To Your Agency" alert', () => {
    const alert = screen.getByText(/Add Members To Your Agency/i);
    fireEvent.click(alert);
    expect(mockHistoryPush).toHaveBeenCalledWith('/manage-members');  // Adjust path if necessary
  });

  it('should render "No Actions Pending" when there are no actions', () => {
    render(
      <MemoryRouter>
        <DashboardActions
          fetching={false}
          memberList={['Member 1']}
          userData={{ agencyInstrId: 1 }}
          projectActions={[]}
          legalDocumentActions={[]}
          acceptTravelFee={[]}
          resumeAlert={[]}
          paymentAlert={[]}
          currentInstrID="all"
          yellowWarning="/path/to/yellowWarning.png"
          greenTick="/path/to/greenTick.png"
          history={{ push: mockHistoryPush }}
          setShowUploadResumeModal={mockSetShowUploadResumeModal}
          showTaskDetailsModal={mockShowTaskDetailsModal}
        />
      </MemoryRouter>
    );

    const noActionsText = screen.getByText(/No Actions Pending/i);
    expect(noActionsText).toBeInTheDocument();
  });

  it('should render alerts when there are actions (e.g., legalDocumentActions)', () => {
    const legalDocumentActions = [
      { type: 'W9', instructorName: 'John Doe' },
    ];
    render(
      <MemoryRouter>
        <DashboardActions
          fetching={false}
          memberList={['Member 1']}
          userData={{ agencyInstrId: 1 }}
          projectActions={[]}
          legalDocumentActions={legalDocumentActions}
          acceptTravelFee={[]}
          resumeAlert={[]}
          paymentAlert={[]}
          currentInstrID="all"
          yellowWarning="/path/to/yellowWarning.png"
          greenTick="/path/to/greenTick.png"
          history={{ push: mockHistoryPush }}
          setShowUploadResumeModal={mockSetShowUploadResumeModal}
          showTaskDetailsModal={mockShowTaskDetailsModal}
        />
      </MemoryRouter>
    );

    const alertText = screen.getByText(/Sign your W9 - John Doe/i);
    expect(alertText).toBeInTheDocument();
  });

  it('should navigate to the correct page when clicking on a legal document action', () => {
    const legalDocumentActions = [
      { type: 'W9', instructorName: 'John Doe' },
    ];
    render(
      <MemoryRouter>
        <DashboardActions
          fetching={false}
          memberList={['Member 1']}
          userData={{ agencyInstrId: 1 }}
          projectActions={[]}
          legalDocumentActions={legalDocumentActions}
          acceptTravelFee={[]}
          resumeAlert={[]}
          paymentAlert={[]}
          currentInstrID="all"
          yellowWarning="/path/to/yellowWarning.png"
          greenTick="/path/to/greenTick.png"
          history={{ push: mockHistoryPush }}
          setShowUploadResumeModal={mockSetShowUploadResumeModal}
          showTaskDetailsModal={mockShowTaskDetailsModal}
        />
      </MemoryRouter>
    );

    const alert = screen.getByText(/Sign your W9 - John Doe/i);
    fireEvent.click(alert);
    expect(mockHistoryPush).toHaveBeenCalledWith('/irs-form');
  });

  it('should call setShowUploadResumeModal when clicking on resume alert', () => {
    const resumeAlert = [
      { name: 'Resume Missing', instrId: 1 },
    ];
    render(
      <MemoryRouter>
        <DashboardActions
          fetching={false}
          memberList={['Member 1']}
          userData={{ agencyInstrId: 1 }}
          projectActions={[]}
          legalDocumentActions={[]}
          acceptTravelFee={[]}
          resumeAlert={resumeAlert}
          paymentAlert={[]}
          currentInstrID="all"
          yellowWarning="/path/to/yellowWarning.png"
          greenTick="/path/to/greenTick.png"
          history={{ push: mockHistoryPush }}
          setShowUploadResumeModal={mockSetShowUploadResumeModal}
          showTaskDetailsModal={mockShowTaskDetailsModal}
        />
      </MemoryRouter>
    );

    const alert = screen.getByText(/Resume Missing/i);
    fireEvent.click(alert);
    expect(mockSetShowUploadResumeModal).toHaveBeenCalledWith({
      showModal: true,
      instrId: 1,
    });
  });
});
