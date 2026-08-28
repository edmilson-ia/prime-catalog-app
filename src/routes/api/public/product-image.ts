import { createFileRoute } from "@tanstack/react-router";

const ID_PATTERN = /^[\w-]{10,80}$/;

export const Route = createFileRoute("/api/public/product-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("id");
        if (!id || !ID_PATTERN.test(id)) {
          return new Response("Invalid id", { status: 400 });
        }

        const upstream = await fetch(
          `https://drive.usercontent.google.com/download?id=${id}&export=view`,
        );
        if (!upstream.ok || !upstream.body) {
          return new Response("Not found", { status: 404 });
        }

        const contentType = upstream.headers.get("content-type") ?? "";
        if (!contentType.startsWith("image/")) {
          return new Response("Not an image", { status: 404 });
        }

        return new Response(upstream.body, {
          headers: {
            "content-type": contentType,
            "cache-control": "public, max-age=86400, s-maxage=604800",
          },
        });
      },
    },
  },
});
