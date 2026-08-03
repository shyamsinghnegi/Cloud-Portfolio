import { GithubIcon, LinkedinIcon, EmailIcon } from "./SocialIcons"

const EMAIL = "shyamsinghnegi54@gmail.com"

const LINKS = [
  { label: "github", href: "https://github.com/shyamsinghnegi", Icon: GithubIcon },
  { label: "linkedin", href: "https://linkedin.com/in/shyam-singhnegi", Icon: LinkedinIcon },
  { label: "email", href: `mailto:${EMAIL}`, Icon: EmailIcon },
]

export default function ContactLinks() {
  return (
    <div className="meta-links">
      {LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target={label === "email" ? undefined : "_blank"}
          rel={label === "email" ? undefined : "noopener noreferrer"}
          aria-label={label}
          className="social-icon"
        >
          <Icon />
        </a>
      ))}
    </div>
  )
}
