import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useExportData } from '@/features/profile';
import { SettingsSubscreen } from '@/features/settings';
import { DownloadIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { ScrollView, View } from 'react-native';

const INCLUDED = [
  'Account email and profile (name, username, bio, location, interests)',
  'Followed organisations and notification preferences',
  'RSVPs, orders, issued tickets and comments you posted',
  'People and organisers you have blocked',
];

export default function DataExportScreen() {
  const { exportData, isExporting } = useExportData();

  return (
    <SettingsSubscreen title="Export my data">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 16 }}>
        <View className="bg-muted/40 items-center gap-3 rounded-2xl p-6">
          <View className="bg-primary/10 size-12 items-center justify-center rounded-full">
            <Icon as={DownloadIcon} className="text-primary size-6" strokeWidth={2} />
          </View>
          <Text className="text-foreground text-center text-lg font-semibold">
            Get a copy of your cheevo data
          </Text>
          <Text className="text-muted-foreground text-center text-sm">
            We'll generate a JSON file with everything we have on you. You can save it, email it
            to yourself, or hand it to another service.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            What's included
          </Text>
          <View className="bg-muted overflow-hidden rounded-2xl">
            {INCLUDED.map((line, i) => (
              <View
                key={i}
                className={`px-4 py-3 ${i < INCLUDED.length - 1 ? 'border-border/60 border-b' : ''}`}>
                <Text className="text-foreground text-sm">{line}</Text>
              </View>
            ))}
          </View>
        </View>

        <Button size="lg" className="w-full" disabled={isExporting} onPress={exportData}>
          {isExporting ? (
            <Spinner size="sm" barClassName="bg-primary-foreground" />
          ) : (
            <Text>Export</Text>
          )}
        </Button>
      </ScrollView>
    </SettingsSubscreen>
  );
}
