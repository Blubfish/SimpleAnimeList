import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { XIcon } from "lucide-react";
import React from "react";

type FilterFormProps = {
  filterOption: string[];
  filterFunction: (selectedStatuses: string[]) => void;
  placeholder: string;
  value: string[];
};

export default function FilterForm({
  filterOption,
  filterFunction,
  placeholder,
  value,
}: FilterFormProps) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      multiple
      autoHighlight
      items={filterOption}
      value={value}
      onValueChange={filterFunction}
    >
      <ComboboxChips
        ref={anchor}
        className="min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm focus-within:border-orange-400 focus-within:ring-orange-400/25"
      >
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip
                  key={value}
                  className="bg-orange-500/15 text-orange-200 ring-1 ring-orange-500/25"
                >
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={values.length === 0 ? placeholder : undefined}
                className="min-w-28 text-slate-100 placeholder:text-slate-500"
              />
            </React.Fragment>
          )}
        </ComboboxValue>

        {value.length > 0 && (
          <button
            type="button"
            aria-label="Clear selected filters"
            onClick={() => filterFunction([])}
            className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-orange-500/10 hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </ComboboxChips>
      <ComboboxContent
        anchor={anchor}
        className="border border-slate-700 bg-slate-950 text-slate-100 shadow-xl ring-0"
      >
        <ComboboxEmpty className="text-slate-500">
          No items found.
        </ComboboxEmpty>
        <ComboboxList className="max-h-64">
          {(item) => (
            <ComboboxItem
              key={item}
              value={item}
              className="text-slate-200 data-highlighted:bg-orange-500/15 data-highlighted:text-orange-200"
            >
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
