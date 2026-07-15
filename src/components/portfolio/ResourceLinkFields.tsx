"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2, Link2 } from "lucide-react";
import { RESOURCE_TYPES, RESOURCE_TYPE_LABELS, DEFAULT_RESOURCE_TYPE, VALIDATION_LIMITS } from "@/constants";
import { RESOURCE_TYPE_ICONS } from "@/lib/resource-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface ResourceLinkFieldsProps {
  disabled?: boolean;
}

const RESOURCE_LINK_LIMIT = 10;

export default function ResourceLinkFields({ disabled }: ResourceLinkFieldsProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "resources",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Project Resources</h3>
          <p className="text-xs text-muted-foreground">
            Tautkan resource pendukung karya ini (GitHub, Live Demo, Google Drive, Figma, dll).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ resource_type: DEFAULT_RESOURCE_TYPE, label: "", url: "" })
          }
          disabled={disabled || fields.length >= RESOURCE_LINK_LIMIT}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Link
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
          Belum ada tautan resource yang ditambahkan.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <ResourceLinkRow
              key={field.id}
              index={index}
              disabled={disabled}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceLinkRow({
  index,
  disabled,
  onRemove,
}: {
  index: number;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const { control } = useFormContext();
  const currentType = useWatch({
    control,
    name: `resources.${index}.resource_type`,
  }) as keyof typeof RESOURCE_TYPE_ICONS | undefined;

  const ResourceIcon = RESOURCE_TYPE_ICONS[currentType ?? "other"] ?? Link2;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-full sm:w-1/4">
            <FormField
              control={control}
              name={`resources.${index}.resource_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Jenis</FormLabel>
                  <Select
                    disabled={disabled}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <span className="flex items-center gap-2 truncate">
                          <ResourceIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <SelectValue placeholder="Pilih" />
                        </span>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RESOURCE_TYPES.map((type) => {
                        const Icon = RESOURCE_TYPE_ICONS[type];
                        return (
                          <SelectItem key={type} value={type}>
                            <span className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              {RESOURCE_TYPE_LABELS[type]}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <FormField
              control={control}
              name={`resources.${index}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Label Tampilan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Kode Sumber"
                      disabled={disabled}
                      maxLength={VALIDATION_LIMITS.RESOURCE_LABEL_MAX}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full sm:flex-1">
            <FormField
              control={control}
              name={`resources.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">URL (dimulai dengan https://)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." disabled={disabled} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 self-end mb-0.5"
            onClick={onRemove}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus tautan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
