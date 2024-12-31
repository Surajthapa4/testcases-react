import { render, screen, fireEvent } from '@testing-library/react';
import HelpfulCenter from './HelpfulCenter'; // Adjust import path as needed
import '@testing-library/jest-dom/extend-expect';

// Mocked data
const mockContent = [
  {
    header: 'How to use the product',
    description: 'A detailed guide on how to use the product.',
    action: jest.fn(),
  },
  {
    header: 'FAQ',
    description: 'Frequently asked questions.',
    action: jest.fn(),
  },
];

const HelpCenterURL = 'https://example.com/help-center';

describe('HelpfulCenter Component', () => {
  test('should render the Help Center header', () => {
    render(<HelpfulCenter mobileView={false} content={mockContent} />);
    const header = screen.getByText('Help Center');
    expect(header).toBeInTheDocument();
  });

  test('should render helpful items based on content', () => {
    render(<HelpfulCenter mobileView={false} content={mockContent} />);
    
    // Check for headers
    mockContent.forEach((data) => {
      const headerText = screen.getByText(data.header);
      expect(headerText).toBeInTheDocument();
    });

    // Check for descriptions
    mockContent.forEach((data) => {
      const descriptionText = screen.getByText(data.description);
      expect(descriptionText).toBeInTheDocument();
    });
  });

  test('should call the action when clicking on the header', () => {
    render(<HelpfulCenter mobileView={false} content={mockContent} />);
    
    // Click on the first item header
    const firstHeader = screen.getByText(mockContent[0].header);
    fireEvent.click(firstHeader);

    // Check if the action function was called
    expect(mockContent[0].action).toHaveBeenCalled();
  });

  test('should render mobile view with appropriate class', () => {
    render(<HelpfulCenter mobileView={true} content={mockContent} />);
    
    // Check if the mobile wrapper class is applied
    const wrapper = screen.getByText('Help Center').closest('div');
    expect(wrapper).toHaveClass('helpfulMobileWrapper');
  });

  test('should render non-mobile view with appropriate class', () => {
    render(<HelpfulCenter mobileView={false} content={mockContent} />);
    
    // Check if the regular wrapper class is applied
    const wrapper = screen.getByText('Help Center').closest('div');
    expect(wrapper).toHaveClass('helpfulWrapper');
  });

  test('should open the Help Center URL when clicking "View All Articles"', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
    
    render(<HelpfulCenter mobileView={false} content={mockContent} />);
    
    const viewAllLink = screen.getByText('View All Articles');
    fireEvent.click(viewAllLink);
    
    expect(openSpy).toHaveBeenCalledWith(HelpCenterURL, '_blank');
    
    openSpy.mockRestore();
  });
});
