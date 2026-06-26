import { render, screen } from "@testing-library/react";
import TabPanel from "../../src/components/TabPanel";

describe("TabPanel", () => {
  it("should render children when value matches index", () => {
    render(
      <TabPanel value={0} index={0}>
        <div>Panel Content</div>
      </TabPanel>
    );
    expect(screen.getByText("Panel Content")).toBeInTheDocument();
  });

  it("should not render children when value does not match index", () => {
    render(
      <TabPanel value={1} index={0}>
        <div>Panel Content</div>
      </TabPanel>
    );
    expect(screen.queryByText("Panel Content")).not.toBeInTheDocument();
  });

  it("should have tabpanel role", () => {
    render(
      <TabPanel value={0} index={0}>
        <div>Content</div>
      </TabPanel>
    );
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });
});
