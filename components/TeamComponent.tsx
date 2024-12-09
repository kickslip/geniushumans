"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const TeamTable = () => {
  const [team, setTeam] = useState([])
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const { toast } = useToast()

  const addMember = () => {
    if (!name.trim() || !role.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both name and role.",
      })
      return
    }

    setTeam([...team, { id: team.length + 1, name: name.trim(), role: role.trim() }])
    setName("")
    setRole("")
    
    toast({
      title: "Success",
      description: "Team member added successfully!",
    })
  }

  const removeMember = (id) => {
    setTeam(team.filter((member) => member.id !== id))
    toast({
      title: "Member Removed",
      description: "Team member has been removed.",
    })
  }

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter') {
      addMember()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={addMember}>
            Add Member
          </Button>
        </div>

        {team.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No team members yet. Add some above!
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TeamTable