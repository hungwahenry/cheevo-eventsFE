import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { PublicOrganisation } from '@/features/organisations/types';
import * as Linking from 'expo-linking';
import { GlobeIcon, MailIcon, PhoneIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  organisation: PublicOrganisation;
};

export function OrgAbout({ organisation }: Props) {
  const hasContact =
    organisation.contact_email !== null ||
    organisation.contact_phone !== null ||
    organisation.website !== null;

  if (!organisation.about && !hasContact && organisation.socials.length === 0) {
    return (
      <Text className="text-muted-foreground py-6 text-center text-sm">
        No bio yet.
      </Text>
    );
  }

  return (
    <View className="gap-5 px-5 py-2">
      {organisation.about ? (
        <Text className="text-foreground text-sm leading-5">{organisation.about}</Text>
      ) : null}

      {hasContact ? (
        <View className="gap-2">
          {organisation.contact_email ? (
            <ContactRow
              icon={MailIcon}
              label={organisation.contact_email}
              onPress={() => Linking.openURL(`mailto:${organisation.contact_email}`)}
            />
          ) : null}
          {organisation.contact_phone ? (
            <ContactRow
              icon={PhoneIcon}
              label={organisation.contact_phone}
              onPress={() => Linking.openURL(`tel:${organisation.contact_phone}`)}
            />
          ) : null}
          {organisation.website ? (
            <ContactRow
              icon={GlobeIcon}
              label={organisation.website}
              onPress={() => Linking.openURL(organisation.website!)}
            />
          ) : null}
        </View>
      ) : null}

      {organisation.socials.length > 0 ? (
        <View className="gap-2">
          {organisation.socials.map((social) =>
            social.url ? (
              <ContactRow
                key={social.platform}
                icon={GlobeIcon}
                label={`${social.name} · @${social.handle}`}
                onPress={() => Linking.openURL(social.url!)}
              />
            ) : null,
          )}
        </View>
      ) : null}
    </View>
  );
}

function ContactRow({
  icon,
  label,
  onPress,
}: {
  icon: typeof GlobeIcon;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-2">
      <Icon as={icon} className="text-muted-foreground" size={16} strokeWidth={2} />
      <Text numberOfLines={1} className="text-foreground text-sm">
        {label}
      </Text>
    </Pressable>
  );
}
