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
      title,
      description,
      "dominantPattern": dominantPattern->title
    }
  }
`;

export const DEFAULT_SCENARIO_PLAY_QUERY = `
  *[_type == "scenario"][0]{
    title,
    "slug": slug.current,
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
      title,
      description,
      "dominantPattern": dominantPattern->title
    }
  }
`;
