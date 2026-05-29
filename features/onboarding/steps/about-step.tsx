import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { BirthdayField } from '@/features/onboarding/components/birthday-field';
import { Field } from '@/features/onboarding/components/field';
import { GenderSelect } from '@/features/onboarding/components/gender-select';
import { OnboardingLayout } from '@/features/onboarding/components/onboarding-layout';
import { useAboutStep } from '@/features/onboarding/hooks';
import { Cake } from 'lucide-react-native';

export function AboutStep() {
  const {
    dateOfBirth,
    gender,
    errors,
    canContinue,
    setDateOfBirth,
    setGender,
    onContinue,
    onBack,
  } = useAboutStep();

  return (
    <OnboardingLayout
      icon={Cake}
      title="A bit about you"
      subtitle="Your birthday helps us show age-appropriate events."
      onBack={onBack}
      footer={
        <Button size="lg" className="w-full" disabled={!canContinue} onPress={onContinue}>
          <Text>Continue</Text>
        </Button>
      }>
      <Field label="Birthday" error={errors.dateOfBirth}>
        <BirthdayField value={dateOfBirth} onChange={setDateOfBirth} />
      </Field>

      <Field label="Gender" error={errors.gender}>
        <GenderSelect value={gender} onSelect={setGender} />
      </Field>
    </OnboardingLayout>
  );
}
