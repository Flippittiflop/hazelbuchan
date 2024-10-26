import { render, screen, fireEvent } from '@testing-library/react';
import ArtworkModal from '@/components/ArtworkModal';

const mockArtwork = {
  src: 'https://example.com/image.jpg',
  alt: 'Test image',
  title: 'Test Title',
  date: '2024',
  description: 'Test description',
};

describe('ArtworkModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders artwork details correctly', () => {
    render(<ArtworkModal artwork={mockArtwork} onClose={mockOnClose} />);
    
    expect(screen.getByText(mockArtwork.title)).toBeInTheDocument();
    expect(screen.getByTestId('modal-header-date')).toHaveTextContent(mockArtwork.date);
    expect(screen.getByText(mockArtwork.description)).toBeInTheDocument();
  });

  it('calls onClose when clicking close button', () => {
    render(<ArtworkModal artwork={mockArtwork} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape key', () => {
    render(<ArtworkModal artwork={mockArtwork} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders image with correct attributes', () => {
    render(<ArtworkModal artwork={mockArtwork} onClose={mockOnClose} />);
    
    const image = screen.getByAltText(mockArtwork.alt);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('displays date in both header and details sections', () => {
    render(<ArtworkModal artwork={mockArtwork} onClose={mockOnClose} />);
    
    const headerDate = screen.getByTestId('modal-header-date');
    const detailsDate = screen.getByTestId('modal-details-date');
    
    expect(headerDate).toHaveTextContent(mockArtwork.date);
    expect(detailsDate).toHaveTextContent(mockArtwork.date);
  });
});