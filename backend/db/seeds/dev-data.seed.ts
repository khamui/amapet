import mongoose from 'mongoose';
import { Circle } from '../models/circle.js';
import { Answer } from '../models/answer.js';
import { User } from '../models/user.js';
import { generateSlug } from '../../utils/slug.utils.js';

// ============================================================================
// SEED USERS (10 users with c3d01_ to c3d10_ prefix + pseudo-words)
// ============================================================================
const SEED_USERS = [
  { prefix: 'c3d01', word1: 'brait', word2: 'shoun' },
  { prefix: 'c3d02', word1: 'glean', word2: 'tost' },
  { prefix: 'c3d03', word1: 'flair', word2: 'kend' },
  { prefix: 'c3d04', word1: 'thump', word2: 'slem' },
  { prefix: 'c3d05', word1: 'choud', word2: 'prant' },
  { prefix: 'c3d06', word1: 'skait', word2: 'vorn' },
  { prefix: 'c3d07', word1: 'drent', word2: 'mouk' },
  { prefix: 'c3d08', word1: 'ploud', word2: 'fent' },
  { prefix: 'c3d09', word1: 'grail', word2: 'teck' },
  { prefix: 'c3d10', word1: 'stour', word2: 'nald' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
interface SeedUser {
  _id: mongoose.Types.ObjectId;
  username: string;
}

function randomUser(users: SeedUser[]): SeedUser {
  return users[Math.floor(Math.random() * users.length)];
}

function randomUsers(users: SeedUser[], count: number, exclude?: string): SeedUser[] {
  const filtered = exclude ? users.filter((u) => u._id.toString() !== exclude) : users;
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function randomUpvotes(users: SeedUser[], exclude: string): string[] {
  const count = Math.floor(Math.random() * 6); // 0-5 upvotes
  return randomUsers(users, count, exclude).map((u) => u._id.toString());
}

function daysAgo(days: number): number {
  return Date.now() - days * 86400000;
}

function randomDaysAgo(minDays: number, maxDays: number): number {
  const days = minDays + Math.random() * (maxDays - minDays);
  return daysAgo(days);
}

// ============================================================================
// CIRCLES DATA (5 circles: 2 EN, 2 DE, 1 FR)
// ============================================================================
const CIRCLES_DATA = [
  // ENGLISH CIRCLES
  {
    name: 'c/pets',
    about: 'general pet talk, questions, cute pics, whatever really',
    ownerIndex: 0, // c3d01
    questions: [
      {
        title: 'my cat wont stop meowing at 3am help',
        body: 'so basically every night around 3am my 2yo tabby goes CRAZY meowing. tried everything, vet says shes healthy. anyone else deal with this?? im losing my mind here',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Just found out my dog has diabetes',
        body: 'devastated rn. hes only 7. vet says its manageable but im scared. anyone have experience with diabetic dogs? what should I expect?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'how do u get ur cat to drink more water',
        body: 'my cat barely drinks anything and im worried about her kidneys. she eats wet food already but still. any tricks?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'dog ate chocolate what do i do',
        body: 'UPDATE: called vet, hes fine it was only a small piece of milk chocolate. leaving this up for others who might panic like i did lol',
        intentionId: 'information',
        hasSolution: false,
      },
      {
        title: 'moving to a new apartment with my cat',
        body: 'first time moving with a pet. any tips? shes super anxious already and im worried the move will stress her out even more',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'pet insurance worth it or nah?',
        body: 'my friends say its a waste of money but then I see ppl with 5k vet bills... what do u guys think? any recommendations?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'why does my dog eat grass',
        body: 'every time we go outside he eats grass like hes a cow lol. is this normal? should i stop him?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'best toys for a bored indoor cat?',
        body: 'my cat is destroying everything cause shes bored i think. whats worked for ur cats? already have a cat tree',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'introducing new kitten to resident cat',
        body: 'getting a kitten next week and my current cat (3yo) has never been around other cats. how do i do this without them killing each other',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'unpopular opinion: dogs are easier than cats',
        body: 'everyone says cats are low maintenance but my cat is way more demanding than any dog ive had. she wants attention 24/7. anyone else?',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/rescue',
    about: 'adoption stories, fostering tips, rescue animals need homes',
    ownerIndex: 1, // c3d02
    questions: [
      {
        title: 'fostering my first dog next week any tips?',
        body: 'signed up to foster and im getting a 4yo pit mix. never fostered before. what should i know??',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'adopted a street cat and shes hiding under the bed',
        body: 'got her 3 days ago and she hasnt come out except to eat at night. is this normal? when will she trust me',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'rescue dog reactive to other dogs',
        body: 'adopted my boy 2 months ago and hes great with people but loses it when he sees other dogs. any training advice?',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'how to help local shelter without adopting',
        body: 'cant have pets in my apartment but want to help. what can i do? they said they need volunteers but idk what that involves',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'my foster fail story lol',
        body: 'was supposed to foster this senior dog for 2 weeks... its been 6 months and shes officially mine now. anyone else fail at fostering?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'adopting a bonded pair worth it?',
        body: 'shelter has 2 cats that have to go together. double the food, double the vet bills... but they look so cute together. thoughts?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'senior pets need love too',
        body: 'adopted my 11yo cat last year everyone thought i was crazy but honestly best decision ever. hes so chill and grateful. consider seniors!!',
        intentionId: 'information',
        hasSolution: false,
      },
      {
        title: 'rescue dog wont eat',
        body: 'brought him home yesterday and he hasnt touched his food. tried different brands. is he just stressed?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'how long before rescue cat shows personality',
        body: 'adopted a cat 2 weeks ago and shes just... there. doesnt play doesnt really react to anything. is this normal?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'anyone else cry when their foster gets adopted',
        body: 'just said goodbye to my foster kitten and im a mess. happy hes going to a good home but still 😭',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  // GERMAN CIRCLES
  {
    name: 'c/haustiere',
    about: 'Alles rund um Haustiere - Fragen, Tipps, Diskussionen',
    ownerIndex: 2, // c3d03
    questions: [
      {
        title: 'Katze frisst seit 2 Tagen nicht mehr',
        body: 'Meine Katze (4J) will seit Montag nix mehr fressen. Trinkt normal, spielt auch noch aber ignoriert das Futter komplett. Tierarzt erst am Donnerstag frei... soll ich in die Notaufnahme?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Empfehlungen für gutes Katzenfutter?',
        body: 'bin grad am umstellen von trockenfutter auf nassfutter. was füttert ihr so? preislich sollte es im rahmen bleiben aber qualität ist mir wichtig',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'Hund hat angst vor gewitter',
        body: 'jedes mal wenn es donnert versteckt er sich unterm bett und zittert. tut mir so leid :( gibts da irgendwas was hilft?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'wie oft muss man katzen impfen lassen',
        body: 'mein ta sagt jedes jahr aber im internet steht alle 3 jahre reicht? was stimmt jetzt',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'hund bellt wenn jemand an der tür klingelt',
        body: 'egal was ich mache er rastet jedes mal komplett aus. ist ein labrador 2 jahre alt. training?',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'katze pinkelt neben katzenklo',
        body: 'seit ner woche macht sie immer daneben. klo ist sauber, nix hat sich verandert. was soll ich tun??',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'welches haustier für kinder geeignet',
        body: 'unsere kids (6 und 8) wollen unbedingt ein haustier. hund ist uns zu viel arbeit ehrlich gesagt. was wäre gut?',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'kosten für einen hund pro monat?',
        body: 'überlegen uns einen hund anzuschaffen. was zahlt ihr so im monat alles zusammen? futter versicherung usw',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'katze kratzt an möbeln trotz kratzbaum',
        body: 'haben extra nen teuren kratzbaum gekauft aber sie benutzt lieber unser sofa. wie bring ich ihr bei den kratzbaum zu nehmen',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'haustier in mietwohnung erlaubt?',
        body: 'im mietvertrag steht nichts dazu. darf ich mir ne katze holen oder muss ich den vermieter fragen?',
        intentionId: 'question',
        hasSolution: true,
      },
    ],
  },
  {
    name: 'c/hunde',
    about: 'Für alle Hundefreunde - Training, Gesundheit, Erfahrungen',
    ownerIndex: 3, // c3d04
    questions: [
      {
        title: 'Welpe beißt ständig in die Leine',
        body: 'unser kleiner (12 wochen golden retriever) zerkaut jede leine die wir kaufen. haben schon 3 durch... hat jemand tipps? oder hört das von selbst auf?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'ab wann darf welpe treppen laufen',
        body: 'wohnen im 2. stock und tragen ihn immer hoch. ab welchem alter ist es ok wenn er selbst läuft?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'hund zieht an der leine was tun',
        body: 'gassi gehen ist echt anstrengend mit ihm. er zieht wie verrückt besonders wenn er andere hunde sieht. wie krieg ich das weg?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'barfen ja oder nein?',
        body: 'freundin schwört drauf aber klingt kompliziert und teuer. lohnt sich das? was sind eure erfahrungen',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'hund alleine lassen wie lange',
        body: 'fange bald neuen job an und muss 6 std weg sein. ist das ok für nen 3 jährigen hund? er ist das nicht gewohnt',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'welcher hund für anfänger',
        body: 'erstes mal hundebesitzer. welche rassen sind einfacher? wohnung ist klein aber park ist direkt nebenan',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'hund frisst kot von anderen hunden hilfe',
        body: 'so eklig sorry aber er macht das andauernd. ist das gefährlich? wie hör ich das auf',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'hundeschule empfehlung berlin',
        body: 'suche gute hundeschule in berlin, am besten kreuzberg oder neukölln. hat jemand tipps?',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'hund hat durchfall seit 3 tagen',
        body: 'frisst normal trinkt normal aber halt durchfall. kein blut oder so. ab wann zum tierarzt?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'eure hunde und silvester',
        body: 'letztes jahr war katastrophe mit dem ganzen geböller. was macht ihr dieses jahr? habt ihr tricks?',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  // FRENCH CIRCLE
  {
    name: 'c/animaux',
    about: 'Discussion sur les animaux de compagnie - chats, chiens, et plus',
    ownerIndex: 4, // c3d05
    questions: [
      {
        title: 'Mon chat refuse sa nouvelle litiere',
        body: 'jai change de marque de litiere (moins chere) et maintenant il fait ses besoins a cote... est-ce que cest normal? dois je revenir a lancienne?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Premier chien - conseils pour debutant?',
        body: 'je vais adopter un chien bientot (un berger australien de 2 ans). jamais eu de chien avant. quest-ce que jaurais du savoir avant??',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'chat qui miaule la nuit sans arret',
        body: 'mon chat de 5 ans miaule toute la nuit depuis 2 semaines. le veto dit quil est en bonne sante. cest quoi le probleme?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'meilleure nourriture pour chat?',
        body: 'actuellement je donne du whiskas mais on ma dit que cest pas terrible. vous donnez quoi a vos chats?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'mon chien a peur des autres chiens',
        body: 'des quil voit un autre chien il tire pour fuir ou il aboie comme un fou. ca rend les promenades tres stressantes. comment je peux laider?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'combien coute un chat par mois',
        body: 'je veux adopter un chat mais je suis etudiant. cest combien par mois en moyenne? nourriture litiere veto etc',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'chat dexterieur ou dinterieur',
        body: 'jhabite en ville avec un balcon. est-ce cruel de garder un chat a linterieur? il aura jamais connu lexterieur',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'mon chien mange trop vite',
        body: 'il avale sa gamelle en 30 secondes et apres il vomit parfois. jai essaye de donner moins mais il a encore faim. des solutions?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'voyager avec son chat en train',
        body: 'je dois prendre le tgv avec mon chat le mois prochain. cest comment? il va stresser? des conseils?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'adoption en refuge vs eleveur',
        body: 'on hesite entre adopter en refuge ou acheter chez un éleveur. quels sont les avantages et inconvenients de chaque?',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
];

// ============================================================================
// ANSWERS DATA (nested/threaded)
// ============================================================================
interface AnswerTemplate {
  text: string;
  replies?: AnswerTemplate[];
  isSolution?: boolean;
}

const ANSWERS_DATA: Record<string, AnswerTemplate[]> = {
  // ==================== c/pets ANSWERS ====================
  'my cat wont stop meowing at 3am help': [
    {
      text: 'have you tried feeding her right before bed? sometimes they meow cause theyre hungry',
      replies: [
        { text: 'this actually worked for my cat! worth a shot' },
      ],
    },
    {
      text: 'play with her for like 30min before bedtime to tire her out. the meowing is probably boredom/excess energy. also make sure shes not in heat lol',
      isSolution: true,
    },
    {
      text: 'lol welcome to cat ownership. mine did this for years. eventually just got earplugs tbh',
      replies: [
        { text: 'same 😂 you get used to it' },
        { text: 'thats not really a solution tho' },
      ],
    },
    { text: 'could be cognitive issues if shes older? my senior cat started doing this' },
  ],
  'Just found out my dog has diabetes': [
    {
      text: 'my dog was diagnosed 3 years ago and hes doing great now! the insulin shots seem scary at first but you get used to it. hang in there',
      replies: [
        { text: 'how much does the insulin cost per month if you dont mind me asking' },
        { text: 'thanks for sharing this gives me hope' },
      ],
    },
    { text: 'its definitely manageable. biggest thing is keeping a consistent feeding schedule. same time every day' },
    { text: 'sorry to hear that :( sending good vibes to you and your pup' },
    { text: 'join a facebook group for diabetic dog owners, theyve been super helpful for us' },
  ],
  'how do u get ur cat to drink more water': [
    {
      text: 'cat fountain changed everything for us. they like running water apparently',
      isSolution: true,
      replies: [
        { text: 'seconding this!! my cat drinks so much more now' },
        { text: 'which brand do u have? some are super loud' },
      ],
    },
    { text: 'put water bowls in different rooms. cats dont like water near their food for some reason' },
    { text: 'add a tiny bit of tuna water to her water bowl. not too much tho cause sodium' },
  ],
  'dog ate chocolate what do i do': [
    { text: 'glad hes ok! for others reading - dark chocolate is way more dangerous than milk chocolate' },
    {
      text: 'good to know! i always panic when my dog gets into stuff. saved the vet number on speed dial lol',
      replies: [
        { text: 'same here 😅' },
      ],
    },
    { text: 'theres a chocolate toxicity calculator online btw. depends on weight and type of chocolate' },
  ],
  'moving to a new apartment with my cat': [
    {
      text: 'keep her in one room first with all her stuff (litter food bed). let her get used to that room before exploring the rest',
      isSolution: true,
    },
    {
      text: 'feliway diffuser helped my anxious cat SO much during our move. plug it in a few days before',
      replies: [
        { text: 'does that stuff actually work? always thought it was a scam' },
        { text: 'worked for us but ymmv i guess' },
      ],
    },
    { text: 'dont wash her blankets before the move. familiar smells help' },
  ],
  'pet insurance worth it or nah?': [
    { text: 'saved my ass when my dog needed emergency surgery. 6k bill and insurance covered 80%' },
    {
      text: 'honestly just put money aside each month into a savings account. insurance has so many exclusions',
      replies: [
        { text: 'this is what i do. works better imo' },
        { text: 'yeah but if something happens early on you dont have enough saved yet' },
      ],
    },
    { text: 'depends on the breed. some breeds have known health issues so insurance makes more sense' },
    { text: 'i have lemonade and theyre pretty good. cheap and easy claims' },
  ],
  'why does my dog eat grass': [
    {
      text: 'totally normal! some dogs just like the taste. as long as the grass isnt treated with chemicals its fine',
      isSolution: true,
    },
    { text: 'old myth says they do it when their stomach is upset but thats not really proven' },
    {
      text: 'mine does it too lol. i call him my little cow 🐄',
      replies: [
        { text: 'haha same!!' },
      ],
    },
  ],
  'best toys for a bored indoor cat?': [
    { text: 'puzzle feeders are great! makes them work for their food' },
    {
      text: 'da bird wand toy. seriously every cat goes crazy for it. also try cardboard boxes lol free and they love em',
      replies: [
        { text: 'can confirm da bird is the best cat toy ever made' },
      ],
    },
    { text: 'rotate toys. put some away for a week then bring them back. theyll seem new again' },
    { text: 'catnip toys if she responds to catnip. not all cats do' },
  ],
  'introducing new kitten to resident cat': [
    {
      text: 'go SLOW. like really slow. separate rooms for at least a week, swap scents, then supervised visits',
      isSolution: true,
      replies: [
        { text: 'this. we rushed it and it took months for them to get along' },
      ],
    },
    { text: 'jackson galaxy has great videos on this. look up his site' },
    { text: 'make sure each cat has their own resources. 2 litter boxes, 2 food spots, etc' },
  ],
  'unpopular opinion: dogs are easier than cats': [
    {
      text: 'disagree lol dogs need walks multiple times a day. cats just need food water and a clean litter box',
      replies: [
        { text: 'yeah but at least dogs are predictable. cats are chaos agents' },
        { text: 'my cat is super low maintenance idk what youre talking about' },
      ],
    },
    { text: 'depends on the individual animal honestly. ive had easy dogs and demanding cats and vice versa' },
    { text: 'sounds like you got a velcro cat lol. some breeds are like that' },
  ],

  // ==================== c/rescue ANSWERS ====================
  'fostering my first dog next week any tips?': [
    {
      text: 'decompression is key! let them settle in, dont overwhelm with attention right away. 3-3-3 rule: 3 days to decompress, 3 weeks to learn routine, 3 months to feel at home',
      isSolution: true,
    },
    {
      text: 'have a safe quiet space ready for them. crate with blanket over it works great',
      replies: [
        { text: 'this! our foster hid in his crate the first few days and thats totally normal' },
      ],
    },
    { text: 'dont judge their personality the first week. theyre stressed and wont show their true self yet' },
    { text: 'take lots of pics for the adoption page! good photos help them get adopted faster' },
  ],
  'adopted a street cat and shes hiding under the bed': [
    {
      text: 'completely normal! some cats take weeks to come out. just leave food water and litter accessible and give her space',
      isSolution: true,
      replies: [
        { text: 'took my rescue cat 3 weeks. now shes a total lovebug' },
      ],
    },
    { text: 'sit in the room and just read or be on your phone. let her get used to your presence without pressure' },
    { text: 'try putting a worn tshirt near her hiding spot. your scent will become familiar' },
  ],
  'rescue dog reactive to other dogs': [
    { text: 'look into BAT training (behavior adjustment training). its specifically for reactive dogs' },
    {
      text: 'distance is your friend. find his threshold distance and work from there. reward calm behavior',
      replies: [
        { text: 'whats threshold distance?' },
        { text: 'basically how far he needs to be from other dogs to not react. could be 50 feet, could be more' },
      ],
    },
    { text: 'hire a trainer who specializes in reactivity. its really hard to fix on your own tbh' },
  ],
  'how to help local shelter without adopting': [
    {
      text: 'volunteering is huge! dog walking, cat socializing, laundry, cleaning... shelters always need help',
      isSolution: true,
    },
    { text: 'donations! check their amazon wishlist. they always need towels, bleach, food' },
    {
      text: 'fostering temporarily is amazing. frees up a kennel for another animal',
      replies: [
        { text: 'second this. even fostering for a weekend helps' },
      ],
    },
    { text: 'share their social media posts! exposure = adoptions' },
  ],
  'my foster fail story lol': [
    {
      text: 'haha foster fail club!! i failed on my second foster. no regrets',
      replies: [
        { text: 'same. was supposed to foster for a week... 3 years later...' },
      ],
    },
    { text: 'this is the best kind of fail tbh. happy for you both!' },
    { text: 'they call it failing but its really winning' },
  ],
  'adopting a bonded pair worth it?': [
    { text: 'did it and no regrets. they keep each other company when im at work' },
    {
      text: 'honestly 2 cats isnt that much more work than 1. food is like $20 more per month. do it!',
      replies: [
        { text: 'vet bills might be more tho' },
        { text: 'true but you can get insurance' },
      ],
    },
    { text: 'if they have to go together itd be sad to separate them. go for it if you can afford it' },
  ],
  'senior pets need love too': [
    { text: 'yes!! adopted my 9yo dog and he was the best dog ever. so chill and grateful' },
    {
      text: 'senior cats are amazing. already past the crazy kitten phase lol',
      replies: [
        { text: 'this. my senior boy just wants to nap and cuddle. perfect' },
      ],
    },
    { text: 'the shelter near me does reduced adoption fees for seniors. worth asking about' },
  ],
  'rescue dog wont eat': [
    {
      text: 'super normal for the first few days. stress kills appetite. just keep offering and dont hover',
      isSolution: true,
    },
    { text: 'try hand feeding! sometimes it helps them trust you' },
    {
      text: 'add some warm water to kibble or a little plain chicken. make it more appealing',
      replies: [
        { text: 'this worked for our rescue. now he eats normally' },
      ],
    },
  ],
  'how long before rescue cat shows personality': [
    {
      text: '3-3-3 rule applies to cats too. 3 days to decompress, 3 weeks to settle, 3 months to fully open up',
      isSolution: true,
    },
    { text: 'my rescue was a completely different cat after 2 months. went from hiding to following me everywhere' },
    { text: 'some cats are just calm/quiet. might be her personality! but give it time' },
  ],
  'anyone else cry when their foster gets adopted': [
    { text: 'every. single. time. but then i remember i helped save their life and that helps' },
    {
      text: 'happy tears! its bittersweet but youre making room to help another one',
      replies: [
        { text: 'this is how i cope too' },
      ],
    },
    { text: 'totally normal. you loved them! but youre doing an amazing thing by fostering' },
    { text: 'i make the adopters send me pics lol. helps to see theyre happy' },
  ],

  // ==================== c/haustiere ANSWERS ====================
  'Katze frisst seit 2 Tagen nicht mehr': [
    {
      text: '2 tage ohne fressen ist bei katzen schon kritisch... würde nicht bis donnerstag warten ehrlich gesagt',
      replies: [
        { text: 'stimmt, katzen können schnell leberschäden bekommen wenn sie zu lange nix fressen' },
      ],
    },
    {
      text: 'Probier mal ein anderes Futter oder wärm es leicht an. Manchmal sind sie einfach wählerisch. Aber wenn sie morgen immer noch nix frisst ab zum notdienst',
      isSolution: true,
    },
    { text: 'hat sie vielleicht draussen was gefangen und gefressen? passiert bei meiner manchmal' },
  ],
  'Empfehlungen für gutes Katzenfutter?': [
    {
      text: 'animonda carny ist gut und nicht zu teuer. gibts im dm',
      replies: [
        { text: 'kann ich bestätigen, meine katzen mögen das' },
      ],
    },
    { text: 'macs ist auch empfehlenswert. hoher fleischanteil' },
    { text: 'schau mal auf katzenfutter-tests.net da gibts gute vergleiche' },
    { text: 'hauptsache kein supermarktfutter wie whiskas oder felix. zu viel zucker und getreide' },
  ],
  'Hund hat angst vor gewitter': [
    {
      text: 'adaptil diffuser kann helfen. und während gewitter einfach normal verhalten, nicht zu viel trösten sonst bestätigst du die angst',
      isSolution: true,
    },
    {
      text: 'mein hund hat ne thundershirt weste. hilft tatsächlich bisschen',
      replies: [
        { text: 'wo gibts die?' },
        { text: 'amazon oder zooplus' },
      ],
    },
    { text: 'eventuell mal mit tierarzt über medikamente reden wenn es sehr schlimm ist' },
  ],
  'wie oft muss man katzen impfen lassen': [
    {
      text: 'grundimmunisierung als kitten, dann auffrischung nach 1 jahr, danach reicht alle 3 jahre für reine wohnungskatzen. freigänger sollten öfter gegen tollwut etc',
      isSolution: true,
    },
    { text: 'kommt auf die impfung an. katzenschnupfen/seuche alle 3 jahre, tollwut jährlich bei freigängern' },
    { text: 'dein ta will halt geld verdienen lol. jedes jahr ist übertrieben' },
  ],
  'hund bellt wenn jemand an der tür klingelt': [
    { text: 'ignorieren bringt nix. trainier ein alternatives verhalten. zb auf seinen platz gehen bei klingeln' },
    {
      text: 'übe erstmal ohne echten besuch. klingel selbst, belohn ruhe. dauert aber',
      replies: [
        { text: 'machen wir grad mit unserem. wird langsam besser' },
      ],
    },
    { text: 'bei nem 2 jährigen labrador wirst du das ohne trainer kaum hinkriegen sorry. such dir hilfe' },
  ],
  'katze pinkelt neben katzenklo': [
    {
      text: 'erstmal: wie viele klos hast du? faustregel ist anzahl katzen + 1',
      replies: [
        { text: 'hab nur eins für eine katze... muss ich echt 2 haben?' },
        { text: 'wäre besser ja' },
      ],
    },
    {
      text: 'kann auch ne blasenentzündung sein. nochmal zum ta und urinprobe machen lassen',
      isSolution: true,
    },
    { text: 'hast du die streu gewechselt? oder den standort? katzen sind da sehr empfindlich' },
  ],
  'welches haustier für kinder geeignet': [
    { text: 'meerschweinchen! die sind robust und tagaktiv. aber mindestens 2 halten!' },
    {
      text: 'kaninchen sind NICHT pflegeleicht btw. viele unterschätzen das',
      replies: [
        { text: 'ja stimmt. und sie wollen auch nicht unbedingt kuscheln' },
      ],
    },
    { text: 'katze wäre auch ne option wenn ihr eine erwachsene adoptiert die bereits mit kindern war' },
  ],
  'kosten für einen hund pro monat?': [
    {
      text: 'bei uns so 150-200€ im monat. futter ~80, versicherung 30, hundeschule/sonstiges der rest. tierarzt kommt extra',
      isSolution: true,
    },
    { text: 'vergiss die anschaffungskosten nicht. erstausstattung kostet auch schnell 300-500€' },
    { text: 'hundesteuer nicht vergessen! je nach stadt 50-200€ pro JAHR' },
  ],
  'katze kratzt an möbeln trotz kratzbaum': [
    {
      text: 'stell den kratzbaum direkt neben die möbel die sie kratzt. dann langsam verschieben wenn sie ihn benutzt',
      isSolution: true,
    },
    { text: 'katzenminze am kratzbaum reiben. macht ihn attraktiver' },
    {
      text: 'plastikfolie oder alufolie an die möbel. mögen katzen nicht',
      replies: [
        { text: 'das hat bei uns funktioniert!' },
      ],
    },
  ],
  'haustier in mietwohnung erlaubt?': [
    {
      text: 'kleintiere (katzen, kleinhunde) kann man nicht generell verbieten. aber frag trotzdem den vermieter zur sicherheit',
      isSolution: true,
    },
    { text: 'wenns nicht im mietvertrag steht kannst du eigentlich. aber nachbarschaft solltest du auch bedenken' },
    { text: 'im zweifel schriftlich beim vermieter anfragen. dann hast du es schwarz auf weiß' },
  ],

  // ==================== c/hunde ANSWERS ====================
  'Welpe beißt ständig in die Leine': [
    {
      text: 'völlig normal in dem alter! hört meistens beim zahnwechsel auf. bis dahin: leine aus metall oder kette probieren',
      isSolution: true,
    },
    {
      text: 'wenn er anfängt stehen bleiben und ignorieren. laufen erst wenn er aufhört',
      replies: [
        { text: 'dauert aber ewig bis der das kapiert' },
      ],
    },
    { text: 'bitterapple spray auf die leine. schmeckt scheisse also lässt er es' },
  ],
  'ab wann darf welpe treppen laufen': [
    {
      text: 'faustregel: bis die gelenke ausgewachsen sind ca 12-18 monate. bei großen rassen länger. tragen ist besser',
      isSolution: true,
    },
    { text: 'frag deinen tierarzt der kann es am besten einschätzen. hängt von der rasse ab' },
    { text: 'runterlaufen ist schlimmer als hochlaufen btw. wegen der belastung' },
  ],
  'hund zieht an der leine was tun': [
    {
      text: 'sobald er zieht: stehen bleiben. nur weitergehen wenn leine locker. ist nervig aber funktioniert',
      isSolution: true,
    },
    { text: 'richtungswechsel helfen auch. immer wenn er zieht andere richtung gehen' },
    {
      text: 'ein geschirr mit brustbügel kann helfen. dann dreht er sich zu dir wenns zieht',
      replies: [
        { text: 'easy walk heisst das glaub ich' },
      ],
    },
  ],
  'barfen ja oder nein?': [
    {
      text: 'machen es seit 5 jahren und unser hund ist topfit. aber du musst dich echt einlesen sonst fehlen nährstoffe',
      replies: [
        { text: 'wo hast du dich informiert?' },
        { text: 'es gibt gute facebook gruppen und ein buch von swanie simon' },
      ],
    },
    { text: 'gutes fertigfutter ist genauso gut und viel einfacher. muss nicht barf sein' },
    { text: 'halb halb geht auch. wir machen morgens barf abends trockenfutter' },
  ],
  'hund alleine lassen wie lange': [
    { text: '6 std ist schon lang wenn ers nicht gewohnt ist. fang mit kurzen zeiten an und steiger langsam' },
    {
      text: 'hol dir nen dogsitter oder gassiservice für mittags. dann sind es nur 2x 3 std',
      replies: [
        { text: 'das machen wir auch so. funktioniert gut' },
      ],
    },
    { text: 'kamera aufstellen damit du siehst wie er reagiert. manche hunde pennen einfach die ganze zeit' },
  ],
  'welcher hund für anfänger': [
    { text: 'labrador oder golden retriever sind klassiker. gutmütig und leicht zu trainieren' },
    {
      text: 'cavalier king charles spaniel für kleine wohnung. super lieb und anpassungsfähig',
      replies: [
        { text: 'aber vorsicht die haben öfter herzprobleme' },
      ],
    },
    { text: 'adopt dont shop! im tierheim gibts tolle mischlingshunde die anfängerfreundlich sind' },
  ],
  'hund frisst kot von anderen hunden hilfe': [
    {
      text: 'nennt sich koprophagie. kann nährstoffmangel sein oder einfach ne schlechte angewohnheit. tierarzt mal drauf ansprechen',
      isSolution: true,
    },
    { text: 'gibts pulver fürs futter das den kot unattraktiv macht. frag in der tierhandlung' },
    { text: 'abruf trainieren! vor dem kot stoppen und belohnen wenn er davon ablässt' },
  ],
  'hundeschule empfehlung berlin': [
    { text: 'martin rütter dogs in lichtenberg ist gut aber teuer' },
    { text: 'guck mal bei stadthunde berlin. die machen auch einzeltraining' },
    { text: 'haben gute erfahrungen mit hundeschule neukölln gemacht. nette trainer' },
  ],
  'hund hat durchfall seit 3 tagen': [
    {
      text: '3 tage würd ich nicht länger warten. kann austrocknen. morgen zum ta wenn nicht besser',
      isSolution: true,
    },
    { text: 'schonkost geben. gekochtes huhn mit reis. kein normales futter' },
    {
      text: 'hat er vielleicht was falsches gefressen beim spaziergang?',
      replies: [
        { text: 'gute frage. manche hunde fressen alles was rumliegt' },
      ],
    },
  ],
  'eure hunde und silvester': [
    { text: 'wir fahren aufs land wo weniger geböllert wird. das hilft am meisten' },
    {
      text: 'adaptil spray auf die decke und musik laut aufdrehen. fenster zu, rollläden runter',
      replies: [
        { text: 'dies. und nicht trösten, normal verhalten' },
      ],
    },
    { text: 'unser ta hat letztes jahr was leichtes zum beruhigen verschrieben. war gold wert' },
    { text: 'gibts auch spezielle silvester cds zum desensibilisieren. monate vorher anfangen damit' },
  ],

  // ==================== c/animaux ANSWERS ====================
  'Mon chat refuse sa nouvelle litiere': [
    {
      text: 'oui cest normal les chats sont tres difficiles. reviens a lancienne litiere et ensuite melange petit a petit si tu veux changer',
      isSolution: true,
    },
    {
      text: 'quelle litiere tu as prise? certaines sentent trop fort pour eux',
      replies: [
        { text: 'probablement ca. celle pas chere sent souvent le parfum' },
      ],
    },
    { text: 'nettoie bien lendroit ou il a fait a cote sinon il va continuer au meme endroit' },
  ],
  'Premier chien - conseils pour debutant?': [
    { text: 'le berger australien cest pas le plus facile pour un premier chien hein... ils ont besoin de beaucoup dactivite' },
    {
      text: 'inscris toi a un cours deducation canine des le debut. ca aide enormement',
      replies: [
        { text: 'oui ca vaut vraiment le coup' },
      ],
    },
    { text: 'patience patience patience. les premiers mois sont durs mais ca vaut le coup' },
    { text: 'achete un bon livre sur leducation positive. evite les methodes punitives' },
  ],
  'chat qui miaule la nuit sans arret': [
    { text: 'il est castre? sinon ca pourrait etre ca' },
    {
      text: 'joue avec lui le soir pour le fatiguer. et donne a manger juste avant de dormir',
      isSolution: true,
    },
    {
      text: 'des fois cest lennui. essaie des jouets interactifs pour la nuit',
      replies: [
        { text: 'genre quoi comme jouet?' },
        { text: 'des balles avec friandises ou des circuits a balles' },
      ],
    },
  ],
  'meilleure nourriture pour chat?': [
    { text: 'whiskas cest vraiment pas terrible. trop de cereales pas assez de viande' },
    {
      text: 'essaie applaws ou almo nature. plus cher mais meilleure qualite',
      replies: [
        { text: 'on trouve ca ou?' },
        { text: 'animalerie ou internet' },
      ],
    },
    { text: 'regarde la composition. le premier ingredient doit etre de la viande pas des cereales' },
  ],
  'mon chien a peur des autres chiens': [
    {
      text: 'desensibilisation progressive. commence de loin et recompense le calme. rapproche toi tres lentement sur plusieurs semaines',
      isSolution: true,
    },
    { text: 'ca vient souvent dune mauvaise socialisation chiot. un educateur peut aider' },
    { text: 'evite de le forcer a rencontrer des chiens. ca empire la peur' },
  ],
  'combien coute un chat par mois': [
    {
      text: 'compte environ 30-50€ par mois. nourriture 20€, litiere 10€, et mets de cote pour le veto',
      isSolution: true,
    },
    {
      text: 'le plus cher cest le veterinaire. prevois un budget annuel de 100-200€ minimum',
      replies: [
        { text: 'et les urgences peuvent couter tres cher' },
      ],
    },
    { text: 'cest raisonnable pour un etudiant si tu fais attention aux depenses' },
  ],
  'chat dexterieur ou dinterieur': [
    { text: 'en ville interieur cest plus sur. les voitures sont dangereuses' },
    {
      text: 'si il a jamais connu lexterieur il sera tres bien a linterieur. cest pas cruel',
      replies: [
        { text: 'tout a fait. le mien est tres heureux en appartement' },
      ],
    },
    { text: 'tu peux amenager le balcon avec un filet de securite. comme ca il a lair frais' },
  ],
  'mon chien mange trop vite': [
    {
      text: 'achete une gamelle anti-glouton. ca le force a manger lentement',
      isSolution: true,
    },
    {
      text: 'ou etale la nourriture sur un tapis de lechage. meme effet',
      replies: [
        { text: 'bonne idee ca!' },
      ],
    },
    { text: 'divise la portion en 2-3 repas dans la journee. moins a chaque fois' },
  ],
  'voyager avec son chat en train': [
    {
      text: 'prends une caisse de transport solide et couvre la avec une couverture. ca le rassure',
      isSolution: true,
    },
    { text: 'pas de nourriture avant le voyage pour eviter quil vomisse' },
    {
      text: 'spray feliway dans la caisse 15min avant. ca calme',
      replies: [
        { text: 'ca marche vraiment ce truc?' },
        { text: 'pour certains chats oui' },
      ],
    },
    { text: 'reserve un billet avec espace pour animaux. cest obligatoire en tgv' },
  ],
  'adoption en refuge vs eleveur': [
    {
      text: 'refuge: tu sauves une vie, moins cher, mais tu connais pas toujours lhistoire de lanimal',
      replies: [
        { text: 'par contre les benevoles connaissent souvent bien le caractere' },
      ],
    },
    { text: 'eleveur: tu sais do vient lanimal, race pure, mais beaucoup plus cher et ethiquement discutable' },
    { text: 'franchement les refuges sont pleins... si tu peux adopter cest mieux' },
  ],
};

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================
export async function seedDevelopmentData(): Promise<void> {
  console.log('[Seed] Creating development sample data...');

  // 1. Create seed users
  console.log('[Seed] Creating users...');
  const createdUsers: SeedUser[] = [];

  for (const userData of SEED_USERS) {
    const username = `${userData.prefix}_${userData.word1}_${userData.word2}`;
    const user = await User.findOneAndUpdate(
      { username },
      {
        username,
        email: `${username}@seed.example.com`,
        authProvider: 'google',
        followedCircles: [],
        followedQuestions: [],
        aura: Math.floor(Math.random() * 500),
      },
      { upsert: true, new: true }
    );
    createdUsers.push({
      _id: user._id as mongoose.Types.ObjectId,
      username: user.username!,
    });
  }
  console.log(`[Seed] Created ${createdUsers.length} users`);

  // 2. Create circles with questions
  console.log('[Seed] Creating circles and questions...');
  const questionsToAnswer: Array<{
    questionId: string;
    questionTitle: string;
    circleId: string;
    hasSolution: boolean;
  }> = [];

  for (const circleData of CIRCLES_DATA) {
    const existing = await Circle.findOne({ name: circleData.name });
    if (existing) {
      console.log(`[Seed] Circle "${circleData.name}" already exists, skipping`);
      // Still collect questions for answers
      for (const q of existing.questions) {
        const template = circleData.questions.find((t) => t.title === q.title);
        questionsToAnswer.push({
          questionId: q._id!.toString(),
          questionTitle: q.title!,
          circleId: (existing._id as mongoose.Types.ObjectId).toString(),
          hasSolution: template?.hasSolution || false,
        });
      }
      continue;
    }

    // Use specific owner based on ownerIndex
    const owner = createdUsers[circleData.ownerIndex];
    const questions = circleData.questions.map((q, idx) => {
      const questionOwner = randomUser(createdUsers);
      return {
        _id: new mongoose.Types.ObjectId(),
        slug: generateSlug(q.title),
        circleId: '', // Set after creation
        ownerId: questionOwner._id.toString(),
        ownerName: questionOwner.username,
        created_at: randomDaysAgo(idx + 1, idx + 7),
        title: q.title,
        body: q.body,
        upvotes: randomUpvotes(createdUsers, questionOwner._id.toString()),
        downvotes: [],
        intentionId: q.intentionId,
        moderationInfo: { status: 'approved' as const },
      };
    });

    const circle = await Circle.create({
      name: circleData.name,
      about: circleData.about,
      ownerId: owner._id.toString(),
      created_at: randomDaysAgo(10, 30),
      memberCount: Math.floor(Math.random() * 50) + 10,
      moderators: [owner._id.toString()],
      questions,
    });

    const circleId = (circle._id as mongoose.Types.ObjectId).toString();

    // Update circleId in questions
    for (const question of circle.questions) {
      question.circleId = circleId;
    }
    await circle.save();

    // Collect questions for answers
    for (let i = 0; i < circle.questions.length; i++) {
      questionsToAnswer.push({
        questionId: circle.questions[i]._id!.toString(),
        questionTitle: circle.questions[i].title!,
        circleId,
        hasSolution: circleData.questions[i].hasSolution,
      });
    }

    console.log(`[Seed] Created circle: ${circleData.name}`);
  }

  // 3. Create answers for questions
  console.log('[Seed] Creating answers...');
  let totalAnswers = 0;

  for (const questionInfo of questionsToAnswer) {
    const answerTemplates = ANSWERS_DATA[questionInfo.questionTitle];
    if (!answerTemplates) continue;

    // Check if answers already exist
    const existingAnswers = await Answer.countDocuments({ parentId: questionInfo.questionId });
    if (existingAnswers > 0) {
      console.log(`[Seed] Answers for "${questionInfo.questionTitle}" already exist, skipping`);
      continue;
    }

    let solutionAnswerId: string | null = null;

    for (const template of answerTemplates) {
      const answerId = await createAnswer(
        questionInfo.questionId,
        'question',
        template,
        createdUsers,
        1
      );

      if (template.isSolution && questionInfo.hasSolution) {
        solutionAnswerId = answerId;
      }

      totalAnswers++;
    }

    // Mark solution if applicable
    if (solutionAnswerId) {
      await Circle.updateOne(
        { _id: questionInfo.circleId, 'questions._id': questionInfo.questionId },
        { $set: { 'questions.$.solutionId': solutionAnswerId } }
      );
    }
  }

  console.log(`[Seed] Created ${totalAnswers} top-level answers (plus nested replies)`);
  console.log('[Seed] Development data seeding complete.');
}

async function createAnswer(
  parentId: string,
  parentType: 'question' | 'answer',
  template: AnswerTemplate,
  users: SeedUser[],
  depth: number
): Promise<string> {
  const owner = randomUser(users);
  const answerId = new mongoose.Types.ObjectId();
  const childIds: mongoose.Types.ObjectId[] = [];

  // Create nested replies first
  if (template.replies && depth < 3) {
    for (const replyTemplate of template.replies) {
      const childId = await createAnswer(answerId.toString(), 'answer', replyTemplate, users, depth + 1);
      childIds.push(new mongoose.Types.ObjectId(childId));
    }
  }

  await Answer.create({
    _id: answerId,
    parentId,
    parentType,
    ownerId: owner._id.toString(),
    ownerName: owner.username,
    created_at: randomDaysAgo(0, depth + 1),
    answerText: template.text,
    upvotes: randomUpvotes(users, owner._id.toString()),
    downvotes: [],
    deleted: false,
    children: childIds,
    moderationInfo: { status: 'approved' as const },
  });

  return answerId.toString();
}
