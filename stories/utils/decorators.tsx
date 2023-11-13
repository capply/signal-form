import type { RemixStubProps } from "@remix-run/testing";
import { createRemixStub } from "@remix-run/testing";
import type { Decorator } from "@storybook/react";

export function createRemixStoryDecorator<T>(
  options: RemixStubProps = {}
): Decorator<T> {
  return (Story) => {
    let RemixStub = createRemixStub([
      {
        path: "/*",
        Component: Story,
        loader: () => ({}),
        action: () => null,
      },
    ]);
    return <RemixStub {...options} />;
  };
}
