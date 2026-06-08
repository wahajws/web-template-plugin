import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SettingsFormModel, SettingsValue } from '@/models/settingsModel';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SettingsFormProps {
  initialData: SettingsFormModel;
  onSubmit: (data: SettingsFormModel) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

interface SettingsFieldProps {
  fieldKey: string;
  fieldPath: string;
  value: SettingsValue;
  onChange: (value: SettingsValue) => void;
  depth?: number;
}

const formatLabel = (fieldKey: string) => {
  return fieldKey
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getSectionDescription = (value: SettingsValue) => {
  if (Array.isArray(value)) {
    return `${value.length} item(s)`;
  }

  if (value !== null && typeof value === 'object') {
    const previewValues = Object.values(value)
      .filter((item) => item !== null && typeof item !== 'object')
      .slice(0, 2)
      .map((item) => String(item));

    return previewValues.length > 0
      ? previewValues.join(' · ')
      : `${Object.keys(value).length} field(s)`;
  }

  return '';
};

const SettingsField: React.FC<SettingsFieldProps> = ({
  fieldKey,
  fieldPath,
  value,
  onChange,
  depth = 0,
}) => {
  const label = formatLabel(fieldKey);
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  if (Array.isArray(value)) {
    return (
      <div className="rounded-md border bg-card">
        <Button
          type="button"
          variant="ghost"
          className="h-auto w-full justify-start rounded-md px-4 py-3 text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded
            ? <ChevronDown className="h-4 w-4 mr-2 shrink-0" />
            : <ChevronRight className="h-4 w-4 mr-2 shrink-0" />}
          <div>
            <div className="font-medium">{label}</div>
            <div className="text-xs font-normal text-muted-foreground">
              {getSectionDescription(value)}
            </div>
          </div>
        </Button>
        {isExpanded && (
          <div className="space-y-4 border-t p-4">
            {value.map((item, index) => (
              <SettingsField
                key={`${fieldPath}-${index}`}
                fieldKey={`${fieldKey} ${index + 1}`}
                fieldPath={`${fieldPath}-${index}`}
                value={item}
                depth={depth + 1}
                onChange={(newValue) => {
                  const updatedValue = [...value];
                  updatedValue[index] = newValue;
                  onChange(updatedValue);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (value !== null && typeof value === 'object') {
    return (
      <div className="rounded-md border bg-card">
        <Button
          type="button"
          variant="ghost"
          className="h-auto w-full justify-start rounded-md px-4 py-3 text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded
            ? <ChevronDown className="h-4 w-4 mr-2 shrink-0" />
            : <ChevronRight className="h-4 w-4 mr-2 shrink-0" />}
          <div>
            <div className="font-medium">{label}</div>
            <div className="max-w-xl truncate text-xs font-normal text-muted-foreground">
              {getSectionDescription(value)}
            </div>
          </div>
        </Button>
        {isExpanded && (
          <div className="space-y-4 border-t p-4">
            {Object.entries(value).map(([key, item]) => (
              <SettingsField
                key={`${fieldPath}-${key}`}
                fieldKey={key}
                fieldPath={`${fieldPath}-${key}`}
                value={item}
                depth={depth + 1}
                onChange={(newValue) => {
                  onChange({
                    ...value,
                    [key]: newValue,
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center justify-between space-x-4 rounded-md border p-3">
        <Label htmlFor={fieldPath}>{label}</Label>
        <Switch
          id={fieldPath}
          checked={value}
          onCheckedChange={onChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldPath}>{label}</Label>
      <Input
        id={fieldPath}
        type={typeof value === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={(event) => {
          const newValue = typeof value === 'number'
            ? Number(event.target.value)
            : event.target.value;
          onChange(newValue);
        }}
      />
    </div>
  );
};

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  title = 'Settings Details',
  description = 'Update the settings values below.',
  submitLabel = 'Save',
}) => {
  const [settingValue, setSettingValue] = useState<SettingsValue>(initialData.settingValue);
  const rootValue = settingValue !== null
    && !Array.isArray(settingValue)
    && typeof settingValue === 'object'
    && Object.keys(settingValue).length === 1
    && initialData.settingKey in settingValue
      ? settingValue[initialData.settingKey]
      : settingValue;

  useEffect(() => {
    setSettingValue(initialData.settingValue);
  }, [initialData]);

  const handleRootChange = (value: SettingsValue) => {
    if (rootValue !== settingValue) {
      setSettingValue({
        ...settingValue as { [key: string]: SettingsValue },
        [initialData.settingKey]: value,
      });
      return;
    }

    setSettingValue(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...initialData,
      settingValue,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="settingKey">Setting Key</Label>
            <Input id="settingKey" value={initialData.settingKey} disabled />
          </div>

          <SettingsField
            fieldKey={initialData.settingKey}
            fieldPath="settingValue"
            value={rootValue}
            onChange={handleRootChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : submitLabel}
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Link to="/admin/settings">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
