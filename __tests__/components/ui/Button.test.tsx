import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with the correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("calls the onClick handler when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /click me/i });

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders the correct variant", () => {
    render(<Button variant="destructive">Destructive</Button>);
    const button = screen.getByRole("button", { name: /destructive/i });

    expect(button).toHaveClass("bg-destructive");
  });

  it("renders the correct size", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button", { name: /small/i });

    expect(button).toHaveClass("h-9");
  });

  it("applies additional className when provided", () => {
    render(<Button className="extra-class">With Class</Button>);
    const button = screen.getByRole("button", { name: /with class/i });

    expect(button).toHaveClass("extra-class");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });

    expect(button).toBeDisabled();
  });
});
