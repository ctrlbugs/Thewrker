"use client";

import { Component, type ReactNode } from "react";
import ActionButton from "@/components/ui/ActionButton";

interface Props {
  children: ReactNode;
  toolName?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ToolErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || "Something went wrong in this tool.",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="pd-operation pd-operation--error rounded-2xl p-5" role="alert">
          <p className="body-emphasized-14pt mb-2">
            {this.props.toolName ?? "This tool"} encountered an error
          </p>
          <p className="body-regular-14 mb-4">{this.state.message}</p>
          <ActionButton
            variant="secondary"
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            Try Again
          </ActionButton>
        </div>
      );
    }

    return this.props.children;
  }
}
