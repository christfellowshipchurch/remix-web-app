/**
 * Spanish workflow 403 stores checkbox/radio values differently from DefinedValue
 * GUIDs. English workflow 902 uses GUIDs for all AllThatApplies options (unchanged).
 */
const SPANISH_ROCK_VALUES_BY_GUID: Record<string, string> = {
  '288ca790-1fb1-4386-9cfa-5fa1c4fbb7cf': 'Encontrar comunidad',
  '81771787-4dd5-4be5-85e4-f3edf770fd94':
    'Hacer la diferencia ayudando como voluntario',
  '2ae99b0a-e0c4-4cf3-823f-459cd74e021a':
    'Descubrir un lugar donde mis hijos se sientan en casa',
  '1d408930-f300-46f8-8200-b465a51049e3': 'Otro',
  'e9abcf96-cbe4-4d6f-8d22-fa5c44736b2c': '1',
  '2c0481e1-6228-4828-8273-7199ff908028': '2',
};

export function getSpanishRockSubmitValue(definedValueGuid: string): string {
  return (
    SPANISH_ROCK_VALUES_BY_GUID[definedValueGuid.toLowerCase()] ??
    definedValueGuid
  );
}
