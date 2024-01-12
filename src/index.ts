import { Elysia, t } from "elysia"
import potrace from 'potrace'
import { swagger } from '@elysiajs/swagger'

async function imageToBuffer(image: string | File) {
    // If image is a file
    if (image instanceof File) {
      const buffer = await image.arrayBuffer()
      return Buffer.from(buffer)
    }

    // If image is a url
    if (image.startsWith("http")) {
      const response = await fetch(image)
      const buffer = await response.arrayBuffer()
      return Buffer.from(buffer)
    }

    // If image is a base64 string
    const base64 = image.split(",")[1]
    return Buffer.from(base64, "base64")
}

function traceImage(image: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    potrace.trace(image, (err: any, svg: Buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(Buffer.from(svg))
      }
    })
  })
}

const app = new Elysia()
  .use(swagger({
    documentation: {
        info: {
            title: 'ImageToSVG',
            version: '1.0.0',
            description: 'Converts an image to SVG, given a URL, base64 string or a file.',
        },

    }
  }))
  .post("/", async (c) => {
    const image = c.body.image
    const buffer = await imageToBuffer(image)

    // Trace the image
    const traced = await traceImage(buffer)

    // Return the image with the correct headers
    return new File([traced], "image.svg", {
      type: "image/svg+xml",
    })
  }, {
    body: t.Object({
      image: t.Union([t.File(), t.String()]),
    }),
    response: {
      200: t.File(),
    },
    detail: {
      summary: "ConvertImageToSVG",
      description: "Converts an image to SVG, given a URL, base64 string or a file.",
    }
  })
  .listen(8000, () => console.log("Listening on port 8000"))

