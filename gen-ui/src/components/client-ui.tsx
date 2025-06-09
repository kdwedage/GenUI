"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { generateUI } from "@/lib/api";
import DOMPurify from "dompurify";

export default function ClientUI() {
  const [description, setDescription] = useState("");
  const [uiCode, setUiCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const { ui, css } = await generateUI(description);

    // Check for dangerous JS or dynamic behavior
    const hasScript = /<script[\s>]|javascript:|on\w+=/i.test(ui);

    if (hasScript) {
      alert("⚠️ Unsafe code detected. Generation skipped.");
      setUiCode("");
      setCssCode("");
    } else {
      const uiCode = DOMPurify.sanitize(ui);
      console.log("Generated code: ", uiCode);
      setUiCode(uiCode);
      setCssCode(css);
    }

    setLoading(false);
  };

  return (
    <div>
      <Textarea
        placeholder="Describe your UI..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate UI"}
      </Button>

      {uiCode && (
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card>
            <h2 className="text-xl font-semibold mb-2">Generated UI</h2>
            <div
              className="border rounded p-4"
              dangerouslySetInnerHTML={{ __html: uiCode }}
            />
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mb-2">CSS Output</h2>
            <CodeBlock code={cssCode} language="css" />
          </Card>
        </div>
      )}
    </div>
  );
}
