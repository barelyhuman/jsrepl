import { render } from "preact";
import { useRef, useState } from "preact/hooks";

const App = () => {
  const tarea = useRef<AceAjax.Editor>();
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState([]);
  const onExec = async () => {
    setErrors([]);
    setOutput("");
    const response = await fetch("/execute", {
      method: "post",
      body: JSON.stringify({
        code: tarea.current?.getValue(),
      }),
    });
    const outData = await response.json();
    if (outData.hasError) {
      setErrors(outData.errors);
    } else {
      setOutput(outData.output);
    }
    const cur = tarea.current?.getCursorPosition();
    tarea.current?.setValue(outData.codeFormatted);
    if (cur) {
      tarea.current?.moveCursorTo(cur.row, cur.column);
    }
    tarea.current?.clearSelection();
  };

  return (
    <div class="h-full w-full">
      <div class="bg-zinc-100 rounded-[28px] p-4 shadow">
        <div class="overflow-hidden bg-white flex flex-col rounded-[20px] min-h-[180px] shadow">
          <div class="p-4">
            <pre
              id="editor"
              class="min-h-[200px] h-full"
              ref={(editorEl) => {
                if (!editorEl) return;
                // @ts-expect-error global
                const editor = ace.edit(editorEl);

                editor.setOptions({
                  fontFamily: "IBM Plex Mono",
                  fontSize: "13.5pt",
                });
                editor.renderer.setShowGutter(false);
                tarea.current = editor;
                editor.setTheme(`ace/theme/xcode`);
                editor.session.setMode(`ace/mode/javascript`);
                editor.focus();
              }}
            ></pre>
          </div>
          <div class="flex justify-end">
            <button class="btn" onClick={onExec}>
              Run &rarr;
            </button>
          </div>
        </div>
        <div class="min-h-[25px] px-4 p-2">
          <h2 class="text-sm text-zinc-400 font-semibold">Output</h2>
          <div>
            {output ? (
              <pre class="whitespace-pre-wrap font-mono">{output}</pre>
            ) : (
              ""
            )}
            <div class="text-red-400">
              {errors
                ? errors.map((errText) => (
                    <pre class="font-mono whitespace-pre-wrap">{errText}</pre>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("app"));
