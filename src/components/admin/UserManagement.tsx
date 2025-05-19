
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface User {
  address: string;
  isAdmin: boolean;
  totalBorrowed: number;
  currentlyBorrowed: number;
  lastActive: Date;
}

interface UserManagementProps {
  users: User[];
  isLoading: boolean;
  onAddUser: (address: string, isAdmin: boolean) => Promise<void>;
  onToggleAdmin: (address: string) => Promise<void>;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  isLoading,
  onAddUser,
  onToggleAdmin
}) => {
  const [newUserAddress, setNewUserAddress] = useState('');
  const [makeAdmin, setMakeAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddUser = async () => {
    if (!newUserAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    try {
      await onAddUser(newUserAddress, makeAdmin);
      setNewUserAddress('');
      setMakeAdmin(false);
      setDialogOpen(false);
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
      console.error("Error adding user:", error);
    }
  };

  const handleToggleAdmin = async (address: string) => {
    try {
      await onToggleAdmin(address);
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Error updating user role:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the blockchain wallet address of the user to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <Input
                  placeholder="0x..."
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="admin-checkbox"
                  checked={makeAdmin}
                  onChange={(e) => setMakeAdmin(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="admin-checkbox" className="text-sm">Grant Admin Privileges</label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Manage users who have access to the DecentraLib application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 mt-2">
            <Input 
              placeholder="Search by address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-library-primary">Loading users...</div>
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all registered users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Currently Borrowed</TableHead>
                  <TableHead>Total Borrowed</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.address}>
                    <TableCell className="font-mono">{`${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}`}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? 'bg-library-primary/20 text-library-primary' : 'bg-gray-100 text-gray-800'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell>{user.currentlyBorrowed}</TableCell>
                    <TableCell>{user.totalBorrowed}</TableCell>
                    <TableCell>{user.lastActive.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user.address)}
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
