import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PictureSelector from "./components/pictureSelector/PictureSelector";

describe("PictureSelector", () => {
  it("renders with a title and upload button", () => {
    const handleChange = vi.fn();
    render(
      <PictureSelector
        title="Avatar Selector"
        imageUrl={null}
        onChangeImage={handleChange}
        testMode
      />
    );

    expect(screen.getByText("Avatar Selector")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit profile picture")).toBeInTheDocument();
    expect(screen.getByText("No image selected")).toBeInTheDocument();
  });

  it("renders with an image and shows delete button", () => {
    const handleChange = vi.fn();
    render(
      <PictureSelector
        title="Avatar Selector"
        imageUrl="https://example.com/avatar.jpg"
        onChangeImage={handleChange}
        testMode
      />
    );

    expect(screen.getByAltText("Profile Picture")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete profile picture")).toBeInTheDocument();
  });
});
