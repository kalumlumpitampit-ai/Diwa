import { Lesson, Unit, Assignment } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    unitId: 'u1',
    title: 'Modern Epics: Conflict and Characterization',
    objectives: [
      'Identify types of conflict (Character vs Character, Society, Nature)',
      'Analyze dynamic characterization through cultural lenses'
    ],
    vocabulary: ['Protagonist', 'Antagonist', 'External Conflict', 'Internal Conflict', 'Bayanihan'],
    discussionText: `
# The Core of Narrative: Conflict and Character

In Grade 9, we look at literature not just as stories, but as reflections of communal values. 

## 1. Structural Context: Conflict
Conflict is the engine of any plot. It is the struggle between opposing forces.
*   **Character vs. Character**: A direct clash between individuals. Think of the rivalry between brothers in local folklore or the tension between a hero and a villain.
*   **Character vs. Society**: A struggle against majority beliefs or heritage. In the Philippines, this often manifests as a character fighting against outdated traditions or systemic injustice (e.g., *Noli Me Tangere*).
*   **Character vs. Nature/Environment**: The struggle against the physical world. For us, this might be the resilience shown during a typhoon or the struggle to protect the ancestral lands.

## 2. Characterization
How do we know who a character is?
*   **Direct Characterization**: The author tells us (e.g., "Si Juan ay matapang").
*   **Indirect Characterization**: We infer through STEAL (Speech, Thoughts, Effect on others, Actions, Looks).

## 3. Cultural Integration: The Filipino Hero
A Filipino hero often embodies *Bayanihan* (communal unity) and *Resilience*. Unlike Western "lone wolf" heroes, our protagonists often find strength through their community or "barangay."
    `,
    prompts: [
      'How does the Filipino value of "Pakikisama" affect how a character might handle a "Character vs. Character" conflict?',
      'Identify a local story where the weather is the main antagonist.'
    ],
    activities: [
      'Write a character sketch of a modern-day hero in your neighborhood.',
      'Group Dramatization: Choose one type of conflict and perform a 2-minute scene set in a Filipino market.'
    ],
    teacherGuide: 'Begin by asking students about their favorite Filipino movies. Transition to identifying the types of conflict present in those films.',
    culturalContext: 'Relate "Character vs. Society" to the life of Jose Rizal or contemporary climate activists in the Philippines.'
  },
  {
    id: 'l2',
    unitId: 'u1',
    title: 'Poetic Structures: Diction, Tone, and Mood',
    objectives: ['Analyze rhyme, meter, and diction in poetry', 'Evaluate tone and mood'],
    vocabulary: ['Rhyme', 'Meter', 'Diction', 'Tone', 'Mood', 'Tanaga'],
    discussionText: `
# The Music of Language: Poetic Elements

Poetry relies on sound devices and linguistic choices to convey meaning.

## 1. Diction and Style
Diction is the choice of words. In Filipino-English poetry, we often see "code-switching" (Taglish) used to establish a specific *Style* or to connect with the *Target Audience*.

## 2. Tone vs. Mood
*   **Tone**: The author's attitude. Is it sarcastic, reverent, or playful?
*   **Mood**: The feeling the reader gets. A poem about a sunset might have a "peaceful" mood.

## 3. Structural Patterns
*   **Rhyme and Meter**: Modern Anglo-American poetry often uses free verse, but traditional forms like the **Tanaga** (a Filipino poetic form with 7-7-7-7 syllables) show our deep-rooted love for structured rhyme and meter.
*   **Patterns and Motifs**: Recurring images (like the sun or the sea) that strengthen the poem’s theme.
    `,
    prompts: [
      'How does an author’s choice to use Tagalog words in an English poem change its Tone?',
      'Describe the Mood of a typical rainy afternoon in Manila.'
    ],
    activities: [
      'Compose a four-line poem (Tanaga style) about your local community.',
      'Analyze the "Diction" used in a popular OPM song lyric.'
    ],
    teacherGuide: 'Use audio recordings of poems being read aloud. Let students focus on the "feel" (Mood) before analyzing the "technique" (Meter).',
    culturalContext: 'Use the "Tanaga" or "Ambahan" as local counterparts to Western poetic structures.'
  },
  {
    id: 'l3',
    unitId: 'u2',
    title: 'Persuasive Power: Ethos, Pathos, and Logos',
    objectives: ['Identify persuasive techniques', 'Analyze propaganda in media'],
    vocabulary: ['Ethos', 'Pathos', 'Logos', 'Card Stacking', 'Name Calling'],
    discussionText: `
# The Art of Persuasion

In an age of information, being able to identify how people try to influence us is a survival skill.

## 1. The Three Pillars of Persuasion
*   **Ethos (Credibility)**: Why should we trust the speaker? (e.g., A doctor endorsing a health product).
*   **Pathos (Emotion)**: Tapping into our feelings. Popular in Filipino commercials—think of "hugot" ads or those that focus on family reunions.
*   **Logos (Logic)**: Using facts, statistics, and reasoning.

## 2. Propaganda Techniques
Propaganda is a biased way of spreading information.
*   **Card Stacking**: Only presenting the good side of a product or person.
*   **Name Calling**: Attacking the opponent instead of their argument.
*   **Ad Nauseum**: Repeating a slogan so many times it becomes "true" in our minds.
*   **Appeal to Justice**: Making the audience feel that supporting the cause is the "right" thing to do.
    `,
    prompts: [
      'Which technique is most common in Philippine political advertisements?',
      'Recall a recent viral "hugot" commercial. Was it using Pathos or Ethos?'
    ],
    activities: [
      'Media Hunt: Find three local news ads and identify the propaganda technique used.',
      'Debate: Use "Logos" to argue for or against a school policy.'
    ],
    teacherGuide: 'Show clips from local advertisements. Have students "vote" on which persuasive pillar is being used most effectively.',
    culturalContext: 'Connect "Pathos" to the Filipino culture of "Hugot" and emotional storytelling.'
  }
];

export const UNITS: Unit[] = [
  {
    id: 'u1',
    term: 'First Term',
    title: 'Literary Echoes: Poetry, Prose, and Drama',
    description: 'Evaluating Anglo-American literature to reflect individual and communal values with a focus on cultural identity.',
    lessonIds: ['l1', 'l2']
  },
  {
    id: 'u2',
    term: 'Second Term',
    title: 'Informational Texts: The Power of Argument',
    description: 'Evaluating argumentative and transactional texts for clarity, purpose, and persuasive impact.',
    lessonIds: ['l3']
  }
];

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    lessonId: 'l1',
    title: 'Reflective Essay on Conflict',
    instructions: 'Write a 300-word essay about a time you experienced "Character vs. Society" conflict in your local school or community. How did you resolve it?',
    points: 100,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'a2',
    lessonId: 'l3',
    title: 'Propaganda analysis',
    instructions: 'Find a local newspaper editorial and identify three propaganda techniques used. Explain why they are effective or manipulative.',
    points: 50,
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'q1',
    lessonId: 'l1',
    title: 'Quiz: Introduction to Conflict',
    instructions: 'Test your understanding of the different types of literary conflict.',
    points: 50,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1_1',
        type: 'multiple-choice',
        text: 'What type of conflict is a character fighting against a majority belief?',
        options: ['Character vs. Character', 'Character vs. Society', 'Character vs. Nature', 'Character vs. Technology']
      },
      {
        id: 'q1_2',
        type: 'short-answer',
        text: 'Briefly define "Bayanihan" in the context of a story protagonist.'
      }
    ]
  }
];
