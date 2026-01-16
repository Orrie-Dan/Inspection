"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const components = [
  {
    id: 1,
    title: "Component One",
    description: "Click to add your link here",
    link: "#",
  },
  {
    id: 2,
    title: "Component Two",
    description: "Click to add your link here",
    link: "#",
  },
  {
    id: 3,
    title: "Component Three",
    description: "Click to add your link here",
    link: "#",
  },
  {
    id: 4,
    title: "Component Four",
    description: "Click to add your link here",
    link: "#",
  },
]

export function DashboardContent() {
  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Manage your dashboard and access all your components from above</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {components.map((component) => (
          <Card key={component.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{component.title}</CardTitle>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
                {component.id}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
