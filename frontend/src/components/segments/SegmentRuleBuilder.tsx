'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { SegmentRule, SegmentRuleGroup } from '@/types/segment';

const FIELDS = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'visitCount', label: 'Visit Count' },
  { value: 'lastVisit', label: 'Last Visit' },
  { value: 'tags', label: 'Tags' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'createdAt', label: 'Created Date' },
];

const OPERATORS = [
  { value: 'eq', label: 'Equals' },
  { value: 'neq', label: 'Not equals' },
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater than or equal' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less than or equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does not contain' },
  { value: 'in', label: 'In list' },
];

interface SegmentRuleBuilderProps {
  rules: SegmentRuleGroup;
  onChange: (rules: SegmentRuleGroup) => void;
}

export default function SegmentRuleBuilder({ rules, onChange }: SegmentRuleBuilderProps) {
  const addCondition = () => {
    const newCondition: SegmentRule = { field: 'totalSpend', operator: 'gt', value: '' };
    onChange({
      ...rules,
      conditions: [...rules.conditions, newCondition],
    });
  };

  const updateCondition = (index: number, updates: Partial<SegmentRule>) => {
    const newConditions = [...rules.conditions];
    newConditions[index] = { ...newConditions[index], ...updates } as SegmentRule;
    onChange({ ...rules, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    onChange({
      ...rules,
      conditions: rules.conditions.filter((_, i) => i !== index),
    });
  };

  const toggleLogic = () => {
    onChange({ ...rules, logic: rules.logic === 'AND' ? 'OR' : 'AND' });
  };

  return (
    <div className="space-y-4">
      {/* Logic toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-surface-500">Match</span>
        <button
          onClick={toggleLogic}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            rules.logic === 'AND'
              ? 'bg-brand-100 text-brand-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {rules.logic === 'AND' ? 'ALL' : 'ANY'}
        </button>
        <span className="text-sm text-surface-500">of the following conditions</span>
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        {(rules.conditions as SegmentRule[]).map((condition, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl border border-surface-200 animate-fade-in">
            <GripVertical className="w-4 h-4 text-surface-300 flex-shrink-0" />

            <select
              value={condition.field}
              onChange={(e) => updateCondition(idx, { field: e.target.value })}
              className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
            >
              {FIELDS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            <select
              value={condition.operator}
              onChange={(e) => updateCondition(idx, { operator: e.target.value })}
              className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
            >
              {OPERATORS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <input
              type="text"
              value={condition.value}
              onChange={(e) => updateCondition(idx, { value: e.target.value })}
              placeholder="Value..."
              className="flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
            />

            <button
              onClick={() => removeCondition(idx)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add condition */}
      <Button variant="ghost" size="sm" onClick={addCondition}>
        <Plus className="w-4 h-4" />
        Add condition
      </Button>
    </div>
  );
}
