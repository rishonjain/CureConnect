import Image from "next/image"

export default function Testimonial() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <blockquote className="text-center">
          <p className="text-2xl md:text-3xl font-medium mb-6">
            "This SaaS solution has transformed our business operations. It's intuitive, powerful, and has significantly
            improved our productivity."
          </p>
          <footer className="flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Jane Doe"
              width={48}
              height={48}
              className="rounded-full mr-4"
            />
            <div>
              <cite className="font-medium">Jane Doe</cite>
              <p className="text-gray-400">CEO, Tech Innovators Inc.</p>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
