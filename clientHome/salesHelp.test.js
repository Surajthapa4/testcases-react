import { render, screen, fireEvent } from '@testing-library/react';
import SalesHelp from './SalesHelp'; // Adjust import path as needed
import '@testing-library/jest-dom/extend-expect';

// Mocked data
const mockDataWithEmail = {
  srEmail: 'test@domain.com',
  srName: 'John Doe',
  srPhone: '123-456-7890',
};

const mockDataWithoutEmail = {};

const mockSendMail = jest.fn();
const mockToggleModal = jest.fn();

describe('SalesHelp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render Sales Representative section when srEmail exists', () => {
    render(
      <SalesHelp
        data={mockDataWithEmail}
        sendMail={mockSendMail}
        toggleModal={mockToggleModal}
      />
    );

    const srEmail = screen.getByText('test@domain.com');
    expect(srEmail).toBeInTheDocument();

    const srPhone = screen.getByText('123-456-7890');
    expect(srPhone).toBeInTheDocument();

    const srName = screen.getByText('Sales Representative');
    expect(srName).toBeInTheDocument();
  });

  test('should render Business Development Team when srName is "House Account SR"', () => {
    const mockData = {
      srEmail: 'test@domain.com',
      srName: 'House Account SR',
    };

    render(
      <SalesHelp
        data={mockData}
        sendMail={mockSendMail}
        toggleModal={mockToggleModal}
      />
    );

    const businessDevTeam = screen.getByText('Business Development Team');
    expect(businessDevTeam).toBeInTheDocument();
  });

  test('should call sendMail when email is clicked', () => {
    render(
      <SalesHelp
        data={mockDataWithEmail}
        sendMail={mockSendMail}
        toggleModal={mockToggleModal}
      />
    );

    const emailLink = screen.getByText('test@domain.com');
    fireEvent.click(emailLink);

    expect(mockSendMail).toHaveBeenCalled();
  });

  test('should render Contact Us section when srEmail does not exist', () => {
    render(
      <SalesHelp
        data={mockDataWithoutEmail}
        sendMail={mockSendMail}
        toggleModal={mockToggleModal}
      />
    );

    const contactUsText = screen.getByText('Contact Us');
    expect(contactUsText).toBeInTheDocument();

    const getInTouchLink = screen.getByText('Get in touch');
    expect(getInTouchLink).toBeInTheDocument();
  });

  test('should call toggleModal when "Get in touch" link is clicked', () => {
    render(
      <SalesHelp
        data={mockDataWithoutEmail}
        sendMail={mockSendMail}
        toggleModal={mockToggleModal}
      />
    );

    const getInTouchLink = screen.getByText('Get in touch');
    fireEvent.click(getInTouchLink);

    expect(mockToggleModal).toHaveBeenCalled();
  });
});
