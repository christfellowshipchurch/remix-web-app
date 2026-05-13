import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../modal.primitive';

describe('Modal', () => {
  it('renders children content when open', () => {
    render(
      <Modal open={true}>
        <Modal.Content>
          <p>Modal body text</p>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByText('Modal body text')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(
      <Modal open={false}>
        <Modal.Content>
          <p>Hidden content</p>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal open={true}>
        <Modal.Content title='My Modal Title'>
          <p>Body</p>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByText('My Modal Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Modal open={true}>
        <Modal.Content description='A helpful description'>
          <p>Body</p>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByText('A helpful description')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(
      <Modal open={true}>
        <Modal.Content>
          <p>Body</p>
        </Modal.Content>
      </Modal>,
    );
    // Dialog.Close renders a button with the cross icon
    const closeBtn = document.querySelector('.cursor-pointer');
    expect(closeBtn).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when close is triggered', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        <Modal.Content>
          <p>Body</p>
        </Modal.Content>
      </Modal>,
    );
    const closeBtn = document.querySelector('.cursor-pointer') as HTMLElement;
    if (closeBtn) await user.click(closeBtn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders trigger button using Modal.Button', () => {
    render(
      <Modal>
        <Modal.Button asChild>
          <button>Open Modal</button>
        </Modal.Button>
        <Modal.Content>
          <p>Body</p>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.getByText('Open Modal')).toBeInTheDocument();
  });

  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <Modal.Button asChild>
          <button>Open</button>
        </Modal.Button>
        <Modal.Content>
          <p>Modal body</p>
        </Modal.Content>
      </Modal>,
    );
    expect(screen.queryByText('Modal body')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });
});
