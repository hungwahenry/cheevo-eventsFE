import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { AvatarPicker } from '@/features/onboarding/components/form-fields/avatar-picker';
import { Field } from '@/features/onboarding/components/form-fields/field';
import { LocationPrompt } from '@/features/onboarding/components/form-fields/location-prompt';
import { UsernameField } from '@/features/onboarding/components/form-fields/username-field';
import { useEditProfile } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { Trash2 } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Pressable, ScrollView, View } from 'react-native';

export default function EditProfileScreen() {
  const {
    control,
    avatarUri,
    removedAvatar,
    currentAvatarUrl,
    avatarSeed,
    pickAvatar,
    clearAvatar,
    usernameStatus,
    usernameDirty,
    locationStatus,
    placeName,
    updateLocation,
    canSave,
    isSaving,
    save,
  } = useEditProfile();

  const visibleAvatarUri = avatarUri ?? (removedAvatar ? null : currentAvatarUrl);

  return (
    <SettingsSubscreen
      title="Edit profile"
      rightAction={
        <Button size="sm" variant="ghost" disabled={!canSave} onPress={save}>
          {isSaving ? (
            <Spinner size="sm" barClassName="bg-foreground" />
          ) : (
            <Text className="text-primary font-semibold">Save</Text>
          )}
        </Button>
      }>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        <View className="items-center gap-3 pb-2">
          <AvatarPicker uri={visibleAvatarUri} seed={avatarSeed} onPress={pickAvatar} size={96} />
          {visibleAvatarUri && !removedAvatar ? (
            <Pressable onPress={clearAvatar} hitSlop={8} className="flex-row items-center gap-1">
              <Icon as={Trash2} className="text-muted-foreground size-3.5" strokeWidth={1.75} />
              <Text className="text-muted-foreground text-xs">Remove photo</Text>
            </Pressable>
          ) : null}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="First name">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input value={value} onChangeText={onChange} onBlur={onBlur} />
                )}
              />
            </Field>
          </View>
          <View className="flex-1">
            <Field label="Last name">
              <Controller
                control={control}
                name="lastName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input value={value} onChangeText={onChange} onBlur={onBlur} />
                )}
              />
            </Field>
          </View>
        </View>

        <Field label="Username">
          <Controller
            control={control}
            name="username"
            render={({ field: { value, onChange, onBlur } }) => (
              <UsernameField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                status={usernameDirty ? usernameStatus : { isChecking: false }}
              />
            )}
          />
        </Field>

        <Field label="Bio">
          <Controller
            control={control}
            name="bio"
            render={({ field: { value, onChange, onBlur } }) => (
              <Textarea
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="A little about you"
                maxLength={500}
              />
            )}
          />
        </Field>

        <Field label="Location">
          <LocationPrompt
            status={locationStatus}
            hasLocation={placeName !== null}
            placeName={placeName}
            onRequest={updateLocation}
          />
        </Field>
      </ScrollView>
    </SettingsSubscreen>
  );
}
