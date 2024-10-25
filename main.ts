import * as prettier from "npm:prettier";
import { serveDir } from "jsr:@std/http/file-server";

const homePage = await Deno.readTextFile("./index.html");

const createPathNameMatcher =
  (pathname: string, prefix: boolean = false) =>
  (toMatch: string) => {
    const reqPath = new URL(toMatch).pathname;
    return prefix ? reqPath.startsWith(pathname) : reqPath === pathname;
  };

const ROUTES = {
  execute: {
    pattern: createPathNameMatcher("/execute"),
    handler: ExecuteCode,
  },
  root: {
    pattern: createPathNameMatcher("/"),
    handler: RenderHome,
  },
  styles: {
    pattern: createPathNameMatcher("/styles.css"),
    handler: RenderStyles,
  },
  assets: {
    pattern: createPathNameMatcher("/assets/", true),
    handler: RenderAssets,
  },
};

type KeyOfRoute = keyof typeof ROUTES;

function RenderAssets(req: Request) {
  return serveDir(req, {
    fsRoot: "dist",
    urlRoot: "assets",
  });
}

function RenderHome(req: Request) {
  return new Response(homePage, {
    headers: {
      "content-type": "text/html",
    },
  });
}

async function RenderStyles(req: Request) {
  const styles = await Deno.readTextFile("./styles.css");
  return new Response(styles, {
    headers: {
      "content-type": "text/css",
    },
  });
}

async function ExecuteCode(req: Request) {
  const bodyData = await req.body?.getReader().read();
  const bodyDataAsString = new TextDecoder().decode(bodyData?.value);
  const body = JSON.parse(bodyDataAsString);

  const command = new Deno.Command(Deno.execPath(), {
    args: ["eval", body.code],
    stdout: "piped",
  });

  const codeFormatted = await formatCode(body.code);
  const output = await command.output();

  return new Response(
    JSON.stringify({
      done: true,
      hasError: !output.success,
      errors: ([] as string[]).concat(formatError(output.stderr)),
      output: new TextDecoder().decode(output.stdout),
      codeFormatted,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

Deno.serve((req) => {
  const mappedPath = Object.keys(ROUTES).find((d) =>
    ROUTES[d as KeyOfRoute].pattern(req.url)
  );
  if (!mappedPath) {
    return new Response("Not Found", {
      status: 404,
    });
  }
  return ROUTES[mappedPath as KeyOfRoute].handler(req);
});

function formatError(error: Uint8Array) {
  return JSON.parse(
    JSON.stringify(new TextDecoder().decode(error)).replace(
      /\\u001b\[[0-9;]*m/g,
      ""
    )
  );
}

async function formatCode(code: string) {
  try {
    return await prettier.format(code, {
      parser: "babel",
    });
  } catch (_err) {
    return code;
  }
}
