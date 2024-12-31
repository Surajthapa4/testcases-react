import { render, screen, fireEvent } from '@testing-library/react';
import ClientDashboardAction from './ClientDashboardAction'; 
import '@testing-library/jest-dom/extend-expect';

// Mock data
const mockLegalDocumentActions = [
  {
    entityType: 'NDA',
    echoSignKey: '1234',
    webText: 'Sign NDA Document',
  },
  {
    entityType: 'MSA',
    echoSignKey: '5678',
    webText: 'Sign MSA Document',
  },
];

const mockProjectActions = [
  {
    entityType: 'Talent Submission',
    projectId: '123',
    webText: 'Talent Submission Pending',
  },
  {
    entityType: 'Other',
    projectId: '456',
    webText: 'Other Action Pending',
  },
];

const mockHistoryPush = jest.fn();

describe('ClientDashboardAction Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render Actions Required header', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const header = screen.getByText('Actions Required');
    expect(header).toBeInTheDocument();
  });

  test('should render legal document actions', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const ndaText = screen.getByText('Sign NDA Document');
    expect(ndaText).toBeInTheDocument();

    const msaText = screen.getByText('Sign MSA Document');
    expect(msaText).toBeInTheDocument();
  });

  test('should navigate to NDA signing page when NDA action is clicked', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const ndaAction = screen.getByText('Sign NDA Document');
    fireEvent.click(ndaAction);

    expect(mockHistoryPush).toHaveBeenCalledWith('/sign-nda/1234');
  });

  test('should navigate to MSA signing page when MSA action is clicked', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const msaAction = screen.getByText('Sign MSA Document');
    fireEvent.click(msaAction);

    expect(mockHistoryPush).toHaveBeenCalledWith('/sign-msa/5678');
  });

  test('should render project actions', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const talentSubmissionText = screen.getByText('Talent Submission Pending');
    expect(talentSubmissionText).toBeInTheDocument();

    const otherActionText = screen.getByText('Other Action Pending');
    expect(otherActionText).toBeInTheDocument();
  });

  test('should navigate to Talent Submission page when Talent Submission action is clicked', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const talentSubmissionAction = screen.getByText('Talent Submission Pending');
    fireEvent.click(talentSubmissionAction);

    expect(mockHistoryPush).toHaveBeenCalledWith('/client-job/jobpost/123');
  });

  test('should navigate to project page when other action is clicked', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={mockProjectActions}
        legalDocumentActions={mockLegalDocumentActions}
        history={{ push: mockHistoryPush }}
      />
    );

    const otherAction = screen.getByText('Other Action Pending');
    fireEvent.click(otherAction);

    expect(mockHistoryPush).toHaveBeenCalledWith('/client-job/job-entity/1/456');
  });

  test('should display "No Actions Pending" when there are no actions', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={[]}
        legalDocumentActions={[]}
        history={{ push: mockHistoryPush }}
      />
    );

    const noActionsText = screen.getByText('No Actions Pending');
    expect(noActionsText).toBeInTheDocument();
  });

  test('should display action required message when no actions are pending', () => {
    render(
      <ClientDashboardAction
        fetching={false}
        projectActions={[]}
        legalDocumentActions={[]}
        history={{ push: mockHistoryPush }}
      />
    );

    const noActionsIcon = screen.getByAltText('greenTickComplete');
    expect(noActionsIcon).toBeInTheDocument();
  });
});
