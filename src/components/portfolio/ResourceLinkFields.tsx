"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { RESOURCE_TYPES } from "@/constants";

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
          <h3 className="text-sm font-medium">Resource Links</h3>
          <p className="text-xs text-muted-foreground">
            Tambahkan tautan terkait karya ini (misal: GitHub, Figma, Demo).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ resource_type: "Link", label: "", url: "" })}
          disabled={disabled || fields.length >= 10}
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
            <Card key={field.id} className="overflow-hidden">
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RESOURCE_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
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
                            <Input placeholder="Contoh: Kode Sumber" disabled={disabled} {...field} />
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
                    onClick={() => remove(index)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
