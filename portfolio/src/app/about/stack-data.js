const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"
const logo = (s, f) => `${DEVICON}/${s}/${f}.svg`

export const CATS = [
  { id: "cloud",    label: "Cloud",       fx: 0.28, fy: 0.20 },
  { id: "frontend", label: "Frontend",    fx: 0.72, fy: 0.18 },
  { id: "backend",  label: "Backend",     fx: 0.29, fy: 0.82 },
  { id: "devops",   label: "DevOps / CI", fx: 0.71, fy: 0.84 },
]

export const TECH = [
  { id: "aws",    cat: "cloud",    label: "AWS",        src: logo("amazonwebservices", "amazonwebservices-original-wordmark") },
  { id: "azure",  cat: "cloud",    label: "Azure",      src: logo("azure", "azure-original") },
  { id: "react",  cat: "frontend", label: "React",      src: logo("react", "react-original") },
  { id: "next",   cat: "frontend", label: "Next.js",    src: logo("nextjs", "nextjs-original") },
  { id: "js",     cat: "frontend", label: "JavaScript", src: logo("javascript", "javascript-original") },
  { id: "python", cat: "backend",  label: "Python",     src: logo("python", "python-original") },
  { id: "node",   cat: "backend",  label: "Node.js",    src: logo("nodejs", "nodejs-original") },
  { id: "mongo",  cat: "backend",  label: "MongoDB",    src: logo("mongodb", "mongodb-original") },
  { id: "cosmos", cat: "backend",  label: "Cosmos DB",  src: logo("cosmosdb", "cosmosdb-original") },
  { id: "dynamo", cat: "backend",  label: "DynamoDB",   src: logo("dynamodb", "dynamodb-original") },
  { id: "docker", cat: "devops",   label: "Docker",     src: logo("docker", "docker-original") },
  { id: "terra",  cat: "devops",   label: "Terraform",  src: logo("terraform", "terraform-original") },
  { id: "gha",    cat: "devops",   label: "GitHub Actions", src: logo("githubactions", "githubactions-original") },
  { id: "linux",  cat: "devops",   label: "Linux",      src: logo("linux", "linux-original") },
]
