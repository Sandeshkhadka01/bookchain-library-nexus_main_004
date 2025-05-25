import React, { useState, useEffect } from 'react';
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
import { makeAdmin, removeAdmin, isAdmin, getSuperAdmin, isUser, getAllUsers, getAllAdmins, removeUser, addUser } from '@/services/blockchainService';
import { useWallet } from '@/hooks/use-wallet';
import contractABI from '@/contracts/BookLibraryABI.json';
import { ethers } from 'ethers';
import { Label } from "@/components/ui/label";

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
  onToggleAdmin?: (address: string) => Promise<void>;
}

const CONTRACT_ADDRESS = import.meta.env.VITE_LIBRARY_CONTRACT_ADDRESS || "";

const fetchAllUsers = async () => {
  if (!window.ethereum) return [];
  const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  const events = await contract.queryFilter('UserAdded');
  // Get unique addresses
  const addresses = Array.from(new Set(events.map(e => (e as ethers.EventLog).args[0])));
  return addresses;
};

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  isLoading,
  onAddUser,
  onToggleAdmin
}) => {
  const [newUserAddress, setNewUserAddress] = useState('');
  const [makeAdminChecked, setMakeAdminChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [superAdmin, setSuperAdmin] = useState<string | null>(null);
  const { address } = useWallet();
  const isCurrentSuperAdmin = address && superAdmin && address.toLowerCase() === superAdmin.toLowerCase();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userAddresses, setUserAddresses] = useState<string[]>([]);
  const [adminAddresses, setAdminAddresses] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const userAddresses = await getAllUsers();
      setUserAddresses(userAddresses);
      const adminAddresses = await getAllAdmins();
      setAdminAddresses(adminAddresses);
      const sa = await getSuperAdmin();
      setSuperAdmin(sa);
    })();
  }, []);

  const handleAddUser = async () => {
    if (!newUserAddress) {
      toast.error("Please enter a wallet address");
      return;
    }
    if (!isCurrentSuperAdmin) {
      toast.error("Only Super Admin can add users");
      return;
    }
    try {
      setActionLoading('add-' + newUserAddress);
      if (makeAdminChecked) {
        await makeAdmin(newUserAddress);
      } else {
        await addUser(newUserAddress);
      }
      setNewUserAddress('');
      setMakeAdminChecked(false);
      setDialogOpen(false);
      toast.success("User added successfully");
      // Refresh users and admins
      setUserAddresses(await getAllUsers());
      setAdminAddresses(await getAllAdmins());
      if (typeof onAddUser === 'function') await onAddUser(newUserAddress, makeAdminChecked);
    } catch (error) {
      toast.error("Failed to add user");
      console.error("Error adding user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveUser = async (address: string) => {
    if (!isCurrentSuperAdmin) {
      toast.error("Only Super Admin can remove users");
      return;
    }
    try {
      setActionLoading('remove-' + address);
      await removeUser(address);
      toast.success("User removed successfully");
      setUserAddresses(await getAllUsers());
      setAdminAddresses(await getAllAdmins());
    } catch (error) {
      toast.error("Failed to remove user");
      console.error("Error removing user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAdmin = async (address: string, isAdminNow: boolean) => {
    if (!isCurrentSuperAdmin) {
      toast.error("Only Super Admin can change admin roles");
      return;
    }
    try {
      setActionLoading('toggle-' + address);
      if (isAdminNow) {
        await removeAdmin(address);
        toast.success("Admin demoted to user");
      } else {
        await makeAdmin(address);
        toast.success("User promoted to admin");
      }
      // Refresh admin list and handle errors separately
      try {
        setAdminAddresses(await getAllAdmins());
        if (typeof onToggleAdmin === 'function') await onToggleAdmin(address);
      } catch (refreshError) {
        console.warn("Role updated, but failed to refresh admin list:", refreshError);
        toast.warning("Role updated, but failed to refresh admin list.");
      }
    } catch (error: any) {
      if (error?.code === 4001) {
        toast.error("Transaction rejected in wallet.");
      } else {
        toast.error("Failed to update user role");
        console.error("Error updating user role:", error);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to get role badge
  const getRoleBadge = (user: User) => {
    if (user.address.toLowerCase() === superAdmin?.toLowerCase()) {
      return <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-900 font-bold">Super Admin</span>;
    }
    if (user.isAdmin) {
      return <span className="px-2 py-1 rounded-full text-xs bg-library-primary/20 text-library-primary">Admin</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">User</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!isCurrentSuperAdmin}>Add New User</Button>
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
                <Label htmlFor="new-user-address">Wallet Address</Label>
                <Input
                  id="new-user-address"
                  placeholder="0x..."
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="admin-checkbox"
                  checked={makeAdminChecked}
                  onChange={(e) => setMakeAdminChecked(e.target.checked)}
                  className="rounded border-gray-300"
                  disabled={!isCurrentSuperAdmin}
                />
                <label htmlFor="admin-checkbox" className="text-sm">Grant Admin Privileges</label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} disabled={!isCurrentSuperAdmin || actionLoading !== null}>
                {actionLoading?.startsWith('add-') ? 'Adding...' : 'Add User'}
              </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAddresses.map((address) => {
                  const isAdminNow = adminAddresses.includes(address);
                  const isSuper = address.toLowerCase() === superAdmin?.toLowerCase();
                  return (
                    <TableRow key={address}>
                      <TableCell className="font-mono">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</TableCell>
                      <TableCell>{isSuper ? 'Super Admin' : isAdminNow ? 'Admin' : 'User'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAdmin(address, isAdminNow)}
                          disabled={!isCurrentSuperAdmin || isSuper || actionLoading === 'toggle-' + address}
                        >
                          {actionLoading === 'toggle-' + address
                            ? (isAdminNow ? 'Removing...' : 'Adding...')
                            : isAdminNow ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        {!isSuper && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveUser(address)}
                            disabled={!isCurrentSuperAdmin || actionLoading === 'remove-' + address}
                          >
                            {actionLoading === 'remove-' + address ? 'Removing...' : 'Remove User'}
                          </Button>
                        )}
                        {isSuper && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled
                            title="Super admin cannot be removed"
                          >
                            Remove User
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {userAddresses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">No users found</TableCell>
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
