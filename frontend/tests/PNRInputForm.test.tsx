import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PNRInputForm } from "@/components/PNRInputForm";

describe("PNRInputForm", () => {
  it("disables the submit button until 10 digits are entered", async () => {
    const onSubmit = vi.fn();
    render(<PNRInputForm onSubmit={onSubmit} />);

    const button = screen.getByRole("button", { name: /track pnr/i });
    expect(button).toBeDisabled();

    const input = screen.getByLabelText(/10-digit pnr number/i);
    await userEvent.type(input, "12345");
    expect(button).toBeDisabled();

    await userEvent.type(input, "67890");
    expect(button).not.toBeDisabled();
  });

  it("strips non-digit characters and caps at 10 digits", async () => {
    const onSubmit = vi.fn();
    render(<PNRInputForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/10-digit pnr number/i) as HTMLInputElement;
    await userEvent.type(input, "25a2b1c703188d99");
    expect(input.value).toBe("2521703188");
  });

  it("shows a validation error when submitting an incomplete PNR", async () => {
    const onSubmit = vi.fn();
    render(<PNRInputForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/10-digit pnr number/i);
    await userEvent.type(input, "123");
    fireEvent.blur(input);

    expect(screen.getByRole("alert")).toHaveTextContent(/exactly 10 digits/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the PNR when a valid 10-digit number is submitted", async () => {
    const onSubmit = vi.fn();
    render(<PNRInputForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/10-digit pnr number/i);
    await userEvent.type(input, "2521703188");
    fireEvent.click(screen.getByRole("button", { name: /track pnr/i }));

    expect(onSubmit).toHaveBeenCalledWith("2521703188");
  });

  it("disables the button and shows a loading label while isLoading is true", () => {
    render(<PNRInputForm onSubmit={vi.fn()} isLoading />);
    const button = screen.getByRole("button", { name: /checking/i });
    expect(button).toBeDisabled();
  });
});
