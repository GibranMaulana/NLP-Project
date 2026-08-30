export const SCENARIO_BY_SLUG_QUERY = `
  *[_type == "scenario" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    prologue
  }
`;

export const ALL_SCENARIOS_QUERY = `
  *[_type == "scenario"]{
    title,
    "slug": slug.current,
    "stagesCount": count(stages)
  }
`;

export const SCENARIO_PLAY_QUERY = `
  *[_type == "scenario" && (slug.current == $slug || _id == $slug)][0]{
    title,
    "slug": slug.current,
    prologue,
    stages[]{
      _key,
      title,
      speaker,
      botPrompt,
      replies[]{
        _key,
        text,
        "valueType": valueType->{
          title,
          description
        }
      }
    },
    diagnoses[]->{
      _id,
      title,
      headline,
      harshTruth,
      conditionType,
      "patternTitle": valueType->title,
      "valueTypes": valueTypes[]->title
    }
  }
`;

export const DEFAULT_SCENARIO_PLAY_QUERY = `
  *[_type == "scenario"][0]{
    title,
    "slug": slug.current,
    prologue,
    stages[]{
      _key,
      title,
      speaker,
      botPrompt,
      replies[]{
        _key,
        text,
        "valueType": valueType->{
          title,
          description
        }
      }
    },
    diagnoses[]->{
      _id,
      title,
      headline,
      harshTruth,
      conditionType,
      "patternTitle": valueType->title,
      "valueTypes": valueTypes[]->title
    }
  }
`;

export const SETTINGS_QUERY = `
  *[_type == "settings"][0]{
    isPrivate
  }
`;

export const ALL_BATCHES_QUERY = `
  *[_type == "batch"]{
    title,
    "slug": slug.current,
    "scenariosCount": count(*[_type == "scenario" && references(^._id)])
  }
`;

export const BATCH_SCENARIOS_QUERY = `
  *[_type == "scenario" && batch->slug.current == $batchId]{
    title,
    "slug": slug.current,
    "stagesCount": count(stages)
  }
`;

export const BATCH_BY_SLUG_QUERY = `
  *[_type == "batch" && slug.current == $batchId][0]{
    title,
    "slug": slug.current
  }
`;

export const BUSINESS_LINK_QUERY = `
  *[_type == "business"][0]{
    titel,
    businessLink
  }
`;
