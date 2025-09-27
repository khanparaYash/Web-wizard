import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-muted p-4">
        <h2 className="text-xl font-bold mb-6">📚 Library</h2>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">Books</Button>
          <Button variant="ghost" className="w-full justify-start">Users</Button>
          <Button variant="ghost" className="w-full justify-start">Issued Books</Button>
          <Button variant="ghost" className="w-full justify-start">Reports</Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button>+ Add Book</Button>
        </header>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,245</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">320</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Books Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">158</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Books</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Atomic Habits</TableCell>
                  <TableCell>James Clear</TableCell>
                  <TableCell>Available</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deep Work</TableCell>
                  <TableCell>Cal Newport</TableCell>
                  <TableCell>Issued</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>The Pragmatic Programmer</TableCell>
                  <TableCell>Andrew Hunt</TableCell>
                  <TableCell>Available</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
