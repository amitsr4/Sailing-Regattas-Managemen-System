// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { Ship, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card.tsx';
import { Alert, AlertDescription } from '../ui/alert.tsx';
import { Label } from '../ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import { Input } from '../ui/input.tsx';
import { Button } from '../ui/button.tsx';

interface ProfileSetupProps {
  onSubmit: (formData: ProfileFormData) => Promise<string>;
  onComplete: () => void;
  onBack: () => void;
}

interface ProfileFormData {
  type: 'individual' | 'club' | 'seriesOrganizer';
  role: 'competitor' | 'admin';
  name: string;
  mobile: string;
  location: string;
}

export function ProfileSetup({
  onSubmit,
  onComplete,
  onBack,
}: ProfileSetupProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    type: 'individual',
    role: 'competitor',
    name: '',
    mobile: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex flex-col items-center">
          <Ship className="h-12 w-12 text-blue-600 mb-4" />
          <CardTitle className="text-2xl font-bold">
            Create Your Profile
          </CardTitle>
          <CardDescription>
            Tell us about yourself to get started
          </CardDescription>
        </div>
      </CardHeader>

      {error && (
        <div className="px-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ProfileFormData['type']) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="seriesOrganizer">
                    Series Organizer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter your location"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </CardFooter>
    </Card>
  );
}
