import mongoose from 'mongoose';
import { Circle } from '../models/circle.js';
import { Answer } from '../models/answer.js';
import { User } from '../models/user.js';

// ============================================================================
// SEED USERS (20 users with c3d01_ to c3d20_ prefix)
// ============================================================================
const SEED_USERS = [
  { prefix: 'c3d01', suffix: 'fluffypal' },
  { prefix: 'c3d02', suffix: 'barkster' },
  { prefix: 'c3d03', suffix: 'meowmix' },
  { prefix: 'c3d04', suffix: 'pawprint' },
  { prefix: 'c3d05', suffix: 'whiskers' },
  { prefix: 'c3d06', suffix: 'tailwag' },
  { prefix: 'c3d07', suffix: 'furrball' },
  { prefix: 'c3d08', suffix: 'snoutdog' },
  { prefix: 'c3d09', suffix: 'catpurr' },
  { prefix: 'c3d10', suffix: 'birdnest' },
  { prefix: 'c3d11', suffix: 'scalefin' },
  { prefix: 'c3d12', suffix: 'hopbun' },
  { prefix: 'c3d13', suffix: 'shelltur' },
  { prefix: 'c3d14', suffix: 'feathfan' },
  { prefix: 'c3d15', suffix: 'pawsup' },
  { prefix: 'c3d16', suffix: 'woofwoof' },
  { prefix: 'c3d17', suffix: 'kittycat' },
  { prefix: 'c3d18', suffix: 'petpal' },
  { prefix: 'c3d19', suffix: 'critter' },
  { prefix: 'c3d20', suffix: 'animalfr' },
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
// CIRCLES DATA (10 pet/animal themed circles)
// ============================================================================
const CIRCLES_DATA = [
  {
    name: 'c/DogLovers',
    about: 'Everything about dogs - breeds, training, health, and cute puppy pics!',
    questions: [
      {
        title: 'My golden retriever won\'t stop barking at the mailman',
        body: 'Every day around 2pm when the mail arrives, my 3-year-old golden goes absolutely crazy. I\'ve tried treats, distraction, nothing works. Any tips from experienced dog owners?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Best dog food brands for sensitive stomachs?',
        body: 'My German Shepherd has been having digestive issues lately. The vet suggested switching to a sensitive stomach formula. What brands have worked well for your dogs?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Just adopted my first rescue dog!',
        body: 'After months of waiting, I finally brought home a 2-year-old lab mix from the shelter. She\'s a bit shy but already warming up. Would love to hear your rescue stories!',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'Guide: How to introduce a new puppy to your older dog',
        body: 'I\'ve successfully introduced several puppies to my household over the years. Here\'s what works:\n\n1. Keep them separated initially\n2. Exchange scents before meeting\n3. First meeting on neutral ground\n4. Supervise all interactions for the first few weeks\n5. Give the older dog their own space\n\nPatience is key!',
        intentionId: 'information',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/CatLife',
    about: 'Cats, kittens, feline behavior and care. Meow!',
    questions: [
      {
        title: 'Why does my cat knock things off tables?',
        body: 'My 4-year-old tabby has made it her mission to push every single item off any flat surface. Is this normal cat behavior or is she just being a jerk?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Indoor vs outdoor cats - what\'s your take?',
        body: 'I\'ve always kept my cats indoors but my neighbor says it\'s cruel. My cats seem perfectly happy with their cat tree and window perches. What does everyone here think?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'Cat not using litter box anymore',
        body: 'My 6-year-old Maine Coon suddenly stopped using his litter box about a week ago. Nothing has changed in our household. Vet says he\'s healthy. Any ideas?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Share your cat\'s weird sleeping positions!',
        body: 'My cat sleeps in the most ridiculous positions. Currently she\'s pretzel-shaped on top of the refrigerator. I can\'t be the only one with a contortionist cat!',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/Aquariums',
    about: 'Fishkeeping, tanks, aquascaping, and everything aquatic',
    questions: [
      {
        title: 'Beginner 20 gallon tank stocking ideas?',
        body: 'Just finished cycling my first 20 gallon freshwater tank. Looking for compatible fish that are relatively easy to care for. Was thinking some tetras and corydoras?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'My betta fish has fin rot - help!',
        body: 'Noticed my betta\'s fins looking ragged yesterday. Water parameters are 0 ammonia, 0 nitrite, 10 nitrate. Temperature is 78F. What treatments do you recommend?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Show off your aquascapes!',
        body: 'I\'m looking for inspiration for my new planted tank. Would love to see everyone\'s setups and hear about your plant choices!',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/ExoticPets',
    about: 'Reptiles, amphibians, and unusual pets',
    questions: [
      {
        title: 'Ball python not eating for 2 months',
        body: 'My ball python hasn\'t eaten since I got her 2 months ago. She\'s active and healthy looking otherwise. Tried live, frozen/thawed, different prey sizes. Any suggestions?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Leopard gecko vs crested gecko for beginners?',
        body: 'Want to get my first reptile. Can\'t decide between these two. What are the pros and cons of each? Which is easier for a complete beginner?',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'My bearded dragon is brumating - is this normal?',
        body: 'My 3-year-old beardie has been sleeping a lot and barely eating for the past week. Temperature and lighting are correct. Is this brumation? When should I be concerned?',
        intentionId: 'question',
        hasSolution: true,
      },
    ],
  },
  {
    name: 'c/BirdWatching',
    about: 'Pet birds and wild bird observation',
    questions: [
      {
        title: 'Best seeds to attract cardinals?',
        body: 'I\'ve been putting out black sunflower seeds but mostly get sparrows. What do cardinals prefer? Any feeder recommendations?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'My cockatiel won\'t stop screaming',
        body: 'Every morning at 6am my cockatiel starts screaming. I\'ve tried covering the cage, ignoring it, nothing works. My neighbors are starting to complain. Help!',
        intentionId: 'question',
        hasSolution: false,
      },
      {
        title: 'Interesting birds spotted this week',
        body: 'Saw a pileated woodpecker in my backyard yesterday! First time seeing one in 10 years of birdwatching here. What interesting sightings have you had recently?',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/SmallPets',
    about: 'Hamsters, guinea pigs, rabbits, ferrets and other small furry friends',
    questions: [
      {
        title: 'Guinea pig making weird noises - should I worry?',
        body: 'My guinea pig makes this rumbling purring sound when I pet her. Is this good or bad? Also sometimes she does these little hops. New to guinea pigs so not sure what\'s normal!',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Rabbit suddenly aggressive',
        body: 'My usually sweet Holland Lop has started lunging and biting when I try to pick him up. He\'s about 6 months old. Is this a hormonal thing? Should I get him neutered?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Best bedding for hamsters?',
        body: 'I\'ve been using wood shavings but heard they might not be safe. What bedding do you use for your hamsters? Looking for something absorbent and dust-free.',
        intentionId: 'question',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/PetHealth',
    about: 'Veterinary advice, pet wellness, and health discussions',
    questions: [
      {
        title: 'Pet insurance - worth it or waste of money?',
        body: 'My vet suggested I get pet insurance for my new puppy. The monthly premiums seem high though. Has anyone actually had insurance pay off? What companies do you recommend?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'How often should I take my cat to the vet?',
        body: 'My indoor cat is 5 years old and seems perfectly healthy. Do I really need annual checkups? Vet visits stress her out so much.',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Signs of pain in pets that are easy to miss',
        body: 'As a vet tech, I see many owners miss subtle signs their pet is in pain. Here are some often overlooked indicators:\n\n- Decreased grooming\n- Changes in sleeping positions\n- Reluctance to jump or climb stairs\n- Subtle changes in facial expressions\n- Decreased appetite\n- Hiding more than usual\n\nWhen in doubt, consult your vet!',
        intentionId: 'information',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/PetTraining',
    about: 'Training tips for all animals',
    questions: [
      {
        title: 'Clicker training basics for dogs',
        body: 'Keep hearing about clicker training but not sure how to start. Do I need a special clicker? How do I teach my dog what the click means?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'How to teach a cat to come when called?',
        body: 'I know cats have a reputation for ignoring us, but I\'ve heard it\'s possible to train them to come. Has anyone successfully done this? What method did you use?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Potty training regression in adult dog',
        body: 'My 4-year-old dog was perfectly house trained but started having accidents inside again. No medical issues according to vet. Any ideas what could cause this?',
        intentionId: 'question',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/PetPhotos',
    about: 'Share cute pet pictures and videos',
    questions: [
      {
        title: 'My cat discovered the printer today',
        body: 'Came home to find my cat sitting ON the printer, having clearly pressed every button. The look on his face was priceless - zero regrets. Anyone else have cats that love electronics?',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'Before and after adoption photos',
        body: 'Adopted this skinny, scared shelter dog 6 months ago. Now look at him! Would love to see everyone\'s pet transformations!',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'Pets being derpy - share your funniest moments',
        body: 'My dog just ran full speed into a glass door. He\'s fine but I\'m still laughing. Share your pets\' most ridiculous moments!',
        intentionId: 'discussion',
        hasSolution: false,
      },
    ],
  },
  {
    name: 'c/RescueAndAdopt',
    about: 'Pet adoption, rescue stories, and fostering experiences',
    questions: [
      {
        title: 'Tips for first-time foster parents?',
        body: 'My local shelter is desperate for foster homes and I finally have the space. What should I know before bringing in my first foster pet?',
        intentionId: 'question',
        hasSolution: true,
      },
      {
        title: 'Adopting a senior pet - my experience',
        body: 'Everyone told me not to adopt a 10-year-old dog because "you won\'t have much time with them." That was 4 years ago and my old man is still going strong. Senior pets deserve love too! Share your senior pet adoption stories!',
        intentionId: 'discussion',
        hasSolution: false,
      },
      {
        title: 'How to help local shelters if you can\'t adopt',
        body: 'Want to help but can\'t have pets in my apartment. What are other ways to support local rescues? I was thinking of volunteering on weekends.',
        intentionId: 'question',
        hasSolution: true,
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
  'My golden retriever won\'t stop barking at the mailman': [
    {
      text: 'Have you tried desensitization training? The key is to start before the mailman arrives and reward calm behavior.',
      replies: [
        { text: 'This worked for my lab! Took about 2 weeks of consistent training.' },
        {
          text: 'How long should each session be?',
          replies: [{ text: 'I did 10-15 minute sessions, twice a day. Short but consistent worked better for us.' }],
        },
      ],
    },
    { text: 'Check out the "engage-disengage" game. It\'s designed exactly for this kind of reactivity.' },
    {
      text: 'The key is to redirect BEFORE the trigger, not after. Try giving a high-value treat the moment you hear the mail truck, before your dog even reacts. Eventually they\'ll associate mail time with treats instead of barking.',
      isSolution: true,
    },
    { text: 'We had the same issue. Ended up asking our mailman to give our dog a treat each day. Now she loves him!' },
  ],
  'Best dog food brands for sensitive stomachs?': [
    {
      text: 'Hill\'s Science Diet Sensitive Stomach worked wonders for my GSD. A bit pricey but worth it.',
      replies: [{ text: 'Second this! My vet specifically recommended Hill\'s.' }],
    },
    { text: 'Try a limited ingredient diet first to rule out allergies. Might not be sensitivity but an actual allergy.' },
    {
      text: 'We switched to Purina Pro Plan Sensitive Skin & Stomach and saw improvement within a week. The salmon formula seems to be the gentlest. Make sure to transition slowly over 7-10 days.',
      isSolution: true,
    },
    { text: 'Have you considered raw feeding? Completely fixed my dog\'s digestive issues.' },
  ],
  'Just adopted my first rescue dog!': [
    { text: 'Congratulations! The first few weeks can be challenging but so rewarding. Look up the "3-3-3 rule" for rescue dogs.' },
    {
      text: 'Give her time and space. My rescue didn\'t show his true personality for about 3 months!',
      replies: [
        { text: 'Same here! Thought my dog was super chill, turns out he was just scared. Now he\'s a total goofball.' },
      ],
    },
    { text: 'Best decision I ever made was adopting. You\'re going to love the journey!' },
    { text: 'Make sure to establish a routine quickly. Rescues thrive on predictability.' },
  ],
  'Why does my cat knock things off tables?': [
    { text: 'It\'s actually hunting behavior! They\'re testing if the "prey" will move.' },
    {
      text: 'Cats do this for attention. Even negative attention is still attention. Try ignoring it completely.',
      replies: [
        { text: 'Can confirm. The moment I stopped reacting, my cat lost interest in knocking stuff over.' },
        { text: 'Mine just does it more aggressively if I ignore it lol' },
      ],
    },
    {
      text: 'It\'s a combination of curiosity, hunting instinct, and yes, sometimes seeking attention. Cats are curious about how objects move and fall. Provide interactive toys that satisfy this curiosity in less destructive ways.',
      isSolution: true,
    },
    { text: 'Welcome to cat ownership! This is just what they do. I\'ve learned to not leave anything breakable on surfaces.' },
  ],
  'Cat not using litter box anymore': [
    {
      text: 'Even if vet says healthy, I\'d push for a urinalysis. UTIs can be sneaky.',
      replies: [{ text: 'Agreed. My cat tested "healthy" initially but a second opinion found crystals.' }],
    },
    { text: 'Could be stress. Any changes outside the house? New neighbors? Construction nearby?' },
    {
      text: 'Try adding a second litter box in a different location. The rule is one box per cat plus one. Also experiment with different litter types - cats can suddenly develop preferences. Finally, make sure the box is in a quiet, private location.',
      isSolution: true,
    },
    { text: 'How often are you cleaning it? Some cats are very particular about cleanliness.' },
    { text: 'Is the box big enough? Maine Coons are huge and need larger boxes than standard ones.' },
  ],
  'Beginner 20 gallon tank stocking ideas?': [
    {
      text: 'Tetras and corys are a great choice! Maybe 8-10 neon tetras and 6 corydoras.',
      replies: [{ text: 'I\'d suggest pandas or bronze corys for beginners. Very hardy!' }],
    },
    {
      text: 'For a 20 gallon, you could do: 10 neon tetras, 6 corydoras, and a small school of cherry shrimp for cleanup. Make sure to add fish slowly - 3-4 at a time with a week in between. This gives your beneficial bacteria time to adjust.',
      isSolution: true,
    },
    { text: 'Whatever you do, avoid common plecos! They get way too big for a 20 gallon.' },
    { text: 'Consider a centerpiece fish too - a honey gourami would be perfect and very peaceful.' },
  ],
  'My betta fish has fin rot - help!': [
    { text: 'Start with clean, warm water and frequent water changes. Sometimes that\'s enough for mild cases.' },
    {
      text: 'For mild fin rot, daily 25% water changes with Indian almond leaves works well. For moderate cases, Kanaplex is effective and betta-safe. Keep the water extra warm (80F) to boost healing. Remove any plastic plants that could snag fins.',
      isSolution: true,
    },
    { text: 'API Fin & Body Cure worked for my betta. Follow the instructions exactly.' },
  ],
  'Ball python not eating for 2 months': [
    {
      text: 'Ball pythons are notorious for going off food. Check your temps and humidity first.',
      replies: [
        { text: 'What are your current temps? Hot side should be 88-92F.' },
        { text: 'Humidity should be 60-70%. Low humidity causes feeding issues.' },
      ],
    },
    {
      text: 'Try these in order: 1) Ensure hot side is 88-92F and humidity is 60-70%, 2) Offer food at night in a dark room, 3) Try leaving the prey item overnight, 4) Some BPs prefer rats over mice or vice versa. Two months isn\'t dangerous for an adult BP - they can go 6+ months safely.',
      isSolution: true,
    },
    { text: 'Is she in a tub or tank? Tanks with screen tops can stress ball pythons and cause hunger strikes.' },
    { text: 'Have you tried braining the prey? Sounds gross but it works for picky eaters.' },
  ],
  'My bearded dragon is brumating - is this normal?': [
    { text: 'Yes, completely normal! Even captive beardies can brumate. Let him sleep but keep water available.' },
    {
      text: 'Brumation is normal for beardies over 1 year old. Signs include: lots of sleeping, hiding, reduced appetite. Keep the basking light on normal schedule but don\'t force food. Offer water by dripping on snout. Only be concerned if they lose significant weight or show signs of illness.',
      isSolution: true,
    },
    { text: 'My beardie brumated for 3 months last year. Totally normal but I was worried too at first!' },
  ],
  'Best seeds to attract cardinals?': [
    { text: 'Black oil sunflower seeds are actually great for cardinals. Try a platform feeder instead of tube.' },
    {
      text: 'Cardinals love safflower seeds! Bonus: squirrels and most other birds don\'t like them, so you get fewer unwanted visitors. Use a hopper or platform feeder as cardinals prefer not to cling.',
      isSolution: true,
    },
    { text: 'Mix of sunflower and safflower works well. Also make sure you have nearby shrubs for cover - cardinals like to feel safe.' },
  ],
  'Guinea pig making weird noises - should I worry?': [
    { text: 'The rumbling is called "purring" and means she\'s content! The hops are "popcorning" - a sign of happiness!' },
    {
      text: 'Congrats, your guinea pig is happy! The rumble-purr when petted means contentment. The little hops are called "popcorning" and it\'s basically the guinea pig version of jumping for joy. These are both great signs that your piggy is comfortable with you!',
      isSolution: true,
    },
    { text: 'Guinea pigs are actually very vocal! Learn all their sounds - wheeks, purrs, rumbles. It\'s like learning a new language!' },
  ],
  'Rabbit suddenly aggressive': [
    {
      text: 'At 6 months, this is almost certainly hormonal. Neutering will likely help significantly.',
      replies: [
        { text: 'Neutered my bun at 6 months and it was night and day difference within a few weeks.' },
        { text: 'How long after neutering did you see improvement?' },
      ],
    },
    {
      text: 'This is classic teenage rabbit behavior! At 6 months they hit puberty and can become territorial and aggressive. Neutering will help both with aggression and also prevent certain cancers. In the meantime, approach at his level rather than reaching down from above, which feels predatory to rabbits.',
      isSolution: true,
    },
    { text: 'Until you get him fixed, try approaching him differently. Get down on his level and let him come to you.' },
  ],
  'How often should I take my cat to the vet?': [
    { text: 'Annual checkups are important even for healthy cats. They hide illness really well.' },
    {
      text: 'For adult cats 1-10 years old, annual wellness exams are recommended. Cats are masters at hiding illness, and early detection is key. Twice yearly is recommended for seniors (10+). The stress of the visit is worth it for catching issues early.',
      isSolution: true,
    },
    { text: 'Ask your vet about fear-free handling techniques. Can make visits much less stressful!' },
    { text: 'My vet does house calls now. Game changer for my anxious kitty.' },
  ],
  'Clicker training basics for dogs': [
    {
      text: 'Any consistent clicking sound works - even a ballpoint pen! The key is the sound is always the same.',
      replies: [{ text: 'I use a retractable pen and it works perfectly!' }],
    },
    {
      text: 'To start clicker training: 1) "Charge" the clicker by clicking and immediately giving a treat, repeat 10-20 times, 2) Your dog will start to associate click = treat, 3) Now use it to mark desired behaviors - click the MOMENT they do something right, then treat. Timing is everything!',
      isSolution: true,
    },
    { text: 'Karen Pryor\'s "Don\'t Shoot the Dog" is the bible of clicker training. Highly recommend!' },
  ],
  'How to teach a cat to come when called?': [
    { text: 'Use treats! Call their name, shake the treat bag, reward when they come. Consistency is key.' },
    {
      text: 'It\'s definitely possible! Start by saying their name or a cue word right before meal times. They\'ll learn to associate the word with good things. Gradually use it at random times with high-value treats. Never use the recall word for anything negative like vet visits or nail trims.',
      isSolution: true,
    },
    { text: 'My cat comes running when I whistle. Started with treats, now she does it just for pets.' },
    { text: 'Takes patience but totally works. My cat responds better than my dog honestly!' },
  ],
  'Tips for first-time foster parents?': [
    {
      text: 'Have a separate room ready for the foster. Helps with adjustment and keeps your own pets safe.',
      replies: [{ text: 'This! Also makes the goodbye easier if they have their own space.' }],
    },
    {
      text: 'Best tips from an experienced foster: 1) Set up a quiet room just for them, 2) Keep foster separate from your pets initially, 3) Take lots of photos for adoption profiles, 4) The first 3 days are hardest - they\'re adjusting, 5) Prepare emotionally for saying goodbye - it\'s hard but you\'re saving lives!',
      isSolution: true,
    },
    { text: 'Take photos! Good pics dramatically increase adoption chances.' },
    { text: 'It\'s called "foster fail" when you keep them... and it\'s okay if that happens! I\'ve failed three times.' },
  ],
  'How to help local shelters if you can\'t adopt': [
    { text: 'Donations are always needed! Old towels, blankets, food, toys all help.' },
    {
      text: 'So many ways to help! 1) Volunteer to walk dogs or socialize cats, 2) Donate supplies (check their wishlist), 3) Share their posts on social media, 4) Foster temporarily, 5) Transport animals to vet appointments or adoption events, 6) Help with administrative tasks. Call your local shelter and ask what they need most!',
      isSolution: true,
    },
    { text: 'Volunteering is amazing. I walk dogs on Saturday mornings and it\'s the best part of my week.' },
    { text: 'Even sharing their social media posts helps! Exposure leads to adoptions.' },
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
    const username = `${userData.prefix}_${userData.suffix}`;
    const user = await User.findOneAndUpdate(
      { username },
      {
        username,
        email: `${username}@seed.example.com`,
        authProvider: 'google',
        followedCircles: [],
        followedQuestions: [],
        respectPoints: Math.floor(Math.random() * 500),
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

    const owner = randomUser(createdUsers);
    const questions = circleData.questions.map((q, idx) => {
      const questionOwner = randomUser(createdUsers);
      return {
        _id: new mongoose.Types.ObjectId(),
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
