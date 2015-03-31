//----------------------------------------------------------------------------------------------------------------------
// Brief description for testdeck.js module.
//
// @module testdeck.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var Promise = require('bluebird');

var api = require('cardcast-api');

//----------------------------------------------------------------------------------------------------------------------

var cards = {
    "calls": [
        {
            "id": "02f20bad-99cc-47c3-958c-fa11a8cf92ed",
            "text": [
                "What ended my last relationship? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "044c1749-79d1-4e62-a50c-ecd4d1074737",
            "text": [
                "I drink to forget ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "057883eb-971c-4686-8b41-953649cac35c",
            "text": [
                "After the earthquake, Sean Penn brought ",
                " to the people of Haiti."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "05981619-74db-424b-b18b-e4b3dfc8fc98",
            "text": [
                "In the new Disney Channel Original Movie, Hannah Montana struggles with ",
                " for the first time."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "0cef4adb-684f-4762-ab11-c4c9da356095",
            "text": [
                "",
                ". High five, bro."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "0fa2c351-1d91-4f49-bcdc-9ae733728eb2",
            "text": [
                "Why can't I sleep at night? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "0fd01e76-1207-48e4-8aff-2f48b55ef54e",
            "text": [
                "What would grandma find disturbing, yet oddly charming? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "120508ff-52a5-4951-9059-34f1b96ebb86",
            "text": [
                "What gives me uncontrollable gas? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "17999abb-9e1d-4119-bb7e-0ff9ff933f47",
            "text": [
                "What is Batman's guilty pleasure? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "18c81a09-0c43-41fa-aa77-076c75b60569",
            "text": [
                "What did the U.S. airdrop to the children of Afghanistan? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "1b29cdad-d4d6-4b9f-bb04-540b4aa5e763",
            "text": [
                "I never truly understood ",
                " until I encountered ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "1c791a84-fccb-4096-b1d5-d5cfbdbb28a9",
            "text": [
                "",
                ". It's a trap!"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "1caad855-a952-41e3-a5e0-0e87e1fc0c1a",
            "text": [
                "What's there a ton of in heaven? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "2331e5a3-927b-428a-9579-120333c40e01",
            "text": [
                "In a world ravaged by ",
                ", our only solace is ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "32476eef-9d61-4c22-a3e8-558d0ab0d3a4",
            "text": [
                "Make a haiku. ",
                " ",
                " ",
                ""
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "32b04405-de5a-426c-8881-f951d8ce8b9d",
            "text": [
                "During Picasso's often-overlooked Brown Period, he produced hundreds of paintings of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "3ba3ffa5-7567-48b2-9e4a-9ea9b1d4460a",
            "text": [
                "What don't you want to find in your Chinese food? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "403772af-c2e3-4389-88a2-2cc5b61d8829",
            "text": [
                "Major League Baseball has banned ",
                " for giving players an unfair advantage."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "41abac57-1b04-43fd-91ec-3de0a9154164",
            "text": [
                "Why am I sticky? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "43795e93-3f24-4213-aee0-78911dd0a112",
            "text": [
                "What's my secret power? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "491ae40b-b9cb-4fde-a356-527e5dcf748b",
            "text": [
                "Alternative medicine is now embracing the curative powers of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "498f659f-7254-4f2f-b92b-9f574fba5c8c",
            "text": [
                "",
                ": good to the last drop."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "4d73a6cb-6538-4681-9a91-4867224d4035",
            "text": [
                "What do old people smell like? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "4eadf287-8a71-465e-96f8-12b1f6bc4b27",
            "text": [
                "What never fails to liven up the party? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "4fadc423-5fa4-4358-b57a-3bcd617e86a3",
            "text": [
                "What will always get you laid? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "527984b6-4e53-40f7-9a56-72a8f6fabefa",
            "text": [
                "What's the next superhero\/sidekick duo? ",
                "\/",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "575817fc-950a-4c90-bb27-43c5806478ae",
            "text": [
                "Instead of coal, Santa now gives the bad children ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "5aca0146-c85b-48a5-bc69-e34f8fa53dd8",
            "text": [
                "What's that sound? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "613c7240-fb49-4fcf-8f3d-4170e70c1ce9",
            "text": [
                "But before I kill you, Mr. Bond, I must show you ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "62d4d605-6e8b-48a4-a513-57faca3dbf09",
            "text": [
                "When I was tripping on acid, ",
                " turned into ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "62db3e55-c3c9-45b7-9545-10b25fc791d3",
            "text": [
                "In L.A. County Jail, word is you can trade 200 cigarettes for ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "65bd1466-73fa-454b-97e2-44323295d536",
            "text": [
                "That's right, I killed ",
                ".  How, you ask?  ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "66a1f94b-aaa4-4e91-b7fb-33f0b0ea9d85",
            "text": [
                "White people like ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "6a810ebf-7da8-4da9-9184-7461d0f1d5f2",
            "text": [
                "What's the most emo? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "70222830-7fbf-4e3f-91d1-d9d786ebf41d",
            "text": [
                "While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "70ba5406-94a5-42b6-becf-457a299f0c54",
            "text": [
                "During sex, I like to think about ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "71a89c61-c7be-444e-b974-8bbdc7476a7a",
            "text": [
                "When I am President of the United States, I will create the Department of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "78315e25-44d8-473d-bd4c-740ecccd72c3",
            "text": [
                "The class field trip was completely ruined by ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "7f8119ff-7d53-4fd5-9a7a-5bbd82609e55",
            "text": [
                "What helps Obama unwind? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8002db40-7bf8-4f18-a574-2566fcfd8a71",
            "text": [
                "I'm sorry professor, but I couldn't complete my homework because of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "81755fd6-6d34-4d64-8bf4-4e199adfd777",
            "text": [
                "Life for American Indians was forever changed when the White Man introduced them to ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "81f59953-6e3b-46b0-9af3-94b8881a2a0e",
            "text": [
                "When Pharaoh remained unmoved, Moses called down a Plague of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "839905ed-7522-449e-9efb-d41ac0b40faf",
            "text": [
                "What's the crustiest? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8411d684-bab2-45fa-a672-68d1837d2964",
            "text": [
                "In M. Night Shyamalan's new movie, Bruce Willis discovers that ",
                " had really been ",
                " all along."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "854ba28f-9d57-4c12-8278-dc20ff81e362",
            "text": [
                "I do not know with what weapons World War III will be fought, but World War IV will be fought with ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8619d465-a7d6-4a9c-a5cd-6de41a9e59f2",
            "text": [
                "Why do I hurt all over? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "89080b9f-91db-4411-a3f5-98abe0036ea5",
            "text": [
                "Maybe she's born with it.  Maybe it's ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8b056cbd-81c5-4d4e-bff1-8ebc7453d7a8",
            "text": [
                "",
                " + ",
                " = ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8fbd2b98-1c4d-48ca-baed-101b078d5903",
            "text": [
                "",
                " is a slippery slope that leads to ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "94cf16f7-2370-44e1-80cc-632f69c9eb58",
            "text": [
                "Anthropologists have recently discovered a primitive tribe that worships ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "965de04a-d88f-45a1-b7f5-dd4443cfaed5",
            "text": [
                "What's my anti-drug? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "a074fcec-b6ad-470a-a116-bad320c8d7ea",
            "text": [
                "It's a pity that kids these days are all getting involved with ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "a218bed5-78e9-4b5c-bbe6-cd6b745306e5",
            "text": [
                "And the Academy Award for ",
                " goes to ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "a3494977-d359-483b-abec-324ca7c29a75",
            "text": [
                "What's the next Happy Meal\u00ae toy? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "a764cb33-f560-42e8-99d6-18be4ff49610",
            "text": [
                "Studies show that lab rats navigate mazes 50% faster after being exposed to ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "aac491b1-7008-4608-b21b-be04bec1c305",
            "text": [
                "TSA guidelines now prohibit ",
                " on airplanes."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ad3f6bfe-e411-4a46-946f-492fb83f7aae",
            "text": [
                "",
                "?  There's an app for that."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "aeb438df-ae73-4ac2-a608-76d85903b2d4",
            "text": [
                "Lifetime\u00ae presents ",
                ", the story of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b44d43ab-280c-4373-8b74-7d63b2c2f4b0",
            "text": [
                "I got 99 problems but ",
                " ain't one."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b59ba701-d727-4004-b29d-4968d030dd83",
            "text": [
                "",
                ". That's how I want to die."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b6c072d0-1364-4397-aebe-33c662c4fdeb",
            "text": [
                "What's Teach for America using to inspire inner city students to succeed? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b7229b28-e2ff-40f8-89ff-c7aec8603d8c",
            "text": [
                "Step 1: ",
                ". Step 2: ",
                ". Step 3: Profit."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "baf345a1-6d36-446d-9d86-a1ce55178212",
            "text": [
                "What's the new fad diet? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "bbbe8176-9746-476e-ab37-015ca332e526",
            "text": [
                "Coming to Broadway this season, ",
                ": The Musical."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "be19d9a3-d3a6-4f0c-ab02-ef22460499b5",
            "text": [
                "In Michael Jackson's final moments, he thought about ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "be6bf04b-a2a5-4d3a-bc5f-2ee10ef2ba64",
            "text": [
                "When I am a billionaire, I shall erect a 50-foot statue to commemorate ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c0f63bd2-9898-435e-8e5b-5d7274dc4bd1",
            "text": [
                "MTV's new reality show features eight washed-up celebrities living with ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c5a77e4a-17f0-4cf4-8ecd-1fe5cd4094f6",
            "text": [
                "What gets better with age? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c6c108b6-c496-4077-b319-da3eb0b9c3cb",
            "text": [
                "What's that smell? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c6c4f9e4-6d74-42d0-9a78-9018aa6f354d",
            "text": [
                "This is the way the world ends. This is the way the world ends. Not with a bang but with ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c70e2556-2fe3-493d-9430-117a08ddd4c7",
            "text": [
                "Next from J.K. Rowling: Harry Potter and the Chamber of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "cdb74a34-7aa4-49ac-9c5f-27857198f228",
            "text": [
                "War!  What is it good for? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "cf40a211-9479-4596-a874-ece6c44bc390",
            "text": [
                "What will I bring back in time to convince people that I am a powerful wizard? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "cffb8933-9fea-4bc2-9e03-9c7f9da4b823",
            "text": [
                "What did Vin Diesel eat for dinner? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "d0bc0e18-c20e-4216-96c3-b1a689b26929",
            "text": [
                "BILLY MAYS HERE FOR ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "d6cadd49-c175-47c9-8a94-1653b7ec029f",
            "text": [
                "In 1,000 years when paper money is but a distant memory, ",
                " will be our currency."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "d7fd9c9b-c49c-4245-b7db-496c9995cfbb",
            "text": [
                "What does Dick Cheney prefer? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "d85c78ad-489b-472c-b87b-62f0978bd317",
            "text": [
                "Dear Abby, I'm having some trouble with ",
                " and would like your advice."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "dbf8e8c8-e203-4bb6-a32d-558a1d4bec63",
            "text": [
                "In an attempt to reach a wider audience, the Smithsonian Museum of Natural History has opened an interactive exhibit on ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "dd59ebc1-4495-49b9-b3bb-37bfa02df683",
            "text": [
                "Rumor has it that Vladimir Putin's favorite dish is ",
                " stuffed with ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "e36f37ce-406f-4efd-87e3-433f0e6ee381",
            "text": [
                "A romantic, candlelit dinner would be incomplete without ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "e5383e6e-3e41-41f1-ba42-3ccf19387d2d",
            "text": [
                "How am I maintaining my relationship status? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ea42b027-da05-4524-be6a-a8b5d85076e6",
            "text": [
                "",
                ": kid-tested, mother-approved."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ec7ff418-8c24-4732-8113-158f26ade11e",
            "text": [
                "What did I bring back from Mexico? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ecf542e6-0983-416e-ba45-cfb17b51f6c2",
            "text": [
                "What are my parents hiding from me? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "efa5c357-a634-4423-8927-83d66bf500f6",
            "text": [
                "Next on ESPN2, the World Series of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "f44a85e0-d19f-4b6e-98e6-2d1270877c06",
            "text": [
                "What am I giving up for Lent? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "f7cff88c-d42a-46b9-a813-12ca5ba97f3a",
            "text": [
                "For my next trick, I will pull ",
                " out of ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "f872a3af-f4d3-4571-b2f5-b1fc4edfdd4c",
            "text": [
                "",
                ". Becha can't have just one!"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "fdeac5b9-c5a8-45ae-9428-0ded004e2ea6",
            "text": [
                "What's a girl's best friend? ",
                "."
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        }
    ],
    "responses": [
        {
            "id": "0064b920-a058-4a48-a16c-4396ef867174",
            "text": [
                "switching to Geico\u00ae"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0130dbe6-2517-430b-a8c8-1ef0d5d06953",
            "text": [
                "bling"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "04d39960-00df-4630-a58b-b53938476093",
            "text": [
                "full frontal nudity"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "05309c60-6783-4b7c-a709-ff1354bf1216",
            "text": [
                "Keanu Reeves"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "067c9e70-a372-4a42-928f-09e661c80ae9",
            "text": [
                "customer service representatives"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "06ca7eb6-57b5-45e9-acdf-f80f6e525386",
            "text": [
                "loose lips"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "074526f8-84b5-443b-8982-0614e971b3ac",
            "text": [
                "chutzpah"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "074d3a23-ccc7-4f5c-854b-f4ab14b4021d",
            "text": [
                "a robust mongoloid"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "079dffe0-c913-4465-b927-f8ff2d62232e",
            "text": [
                "centaurs"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "07fb7222-988c-43a0-a505-ffd146545b8b",
            "text": [
                "children on leashes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "08a7a7ac-0807-47ad-9650-9694c15cde7a",
            "text": [
                "spontaneous human combustion"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "08bed972-8421-4bcd-9374-4c89711ec9cb",
            "text": [
                "a Super Soaker\u2122 full of cat pee"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "090736c4-b76a-4c5e-85ae-74497b7f8055",
            "text": [
                "the violation of our most basic human rights"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "09bb8fd3-5cae-4986-bbed-24fd8854d640",
            "text": [
                "classist undertones"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "09cc823c-8cf7-4b07-8ade-1c0c50279f2b",
            "text": [
                "daddy issues"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0a338afc-b3e0-4b40-a267-8b6e0d506e41",
            "text": [
                "whipping it out"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0adaf72f-524a-44c1-90ed-14618e1ed9f9",
            "text": [
                "Oompa-Loompas"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0b37d3b2-df7e-4c61-b8f5-227f754fe14c",
            "text": [
                "Nazis"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "0b7fcc17-b8ca-4855-b030-0567823ba5ce",
            "text": [
                "parting the Red Sea"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0c1cbf66-ecff-4245-ab09-c14eaee6c0a4",
            "text": [
                "flightless birds"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0c9ce295-7a70-48b9-88b3-b85da3fd5563",
            "text": [
                "Aaron Burr"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0d50be0c-2310-4232-a301-bd4c76e68069",
            "text": [
                "science"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "0d851f92-d192-4a16-80d1-f38cae63b0a8",
            "text": [
                "sunshine and rainbows"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0eba628c-558b-4a94-a847-d8ed607163e1",
            "text": [
                "chivalry"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "0f243d29-7b39-4b3b-ba1e-a7361c7dd108",
            "text": [
                "black people"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "100a558c-9502-496c-9213-4cc7b5c2f621",
            "text": [
                "the thing that electrocutes your abs"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "103efc77-4a0e-4436-8551-25a679dda789",
            "text": [
                "a bag of magic beans"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1059afe9-3689-4a45-8319-189c10fe6eaf",
            "text": [
                "doin' it in the butt"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "108ca54d-2f51-4edf-9780-3ee121775d10",
            "text": [
                "GoGurt\u00ae"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1121e63d-6ea6-4dc4-bfb0-74fae3ddc51d",
            "text": [
                "kids with ass cancer"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "116e6998-78c2-4045-903a-b5d56b83379e",
            "text": [
                "the Pope"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "116f70ef-b4fb-4a8d-98e9-6d5b3fc3dc08",
            "text": [
                "praying the gay away"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "119444e5-6228-4ceb-b373-1be759109738",
            "text": [
                "waking up half-naked in a Denny's parking lot"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1199d05c-a6c8-46b6-a586-b30e3749b1e1",
            "text": [
                "God"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "13243f95-ba1b-418e-97d2-75bb6f2007ab",
            "text": [
                "the Rev. Dr. Martin Luther King, Jr"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "13f8ab47-de62-48df-90d8-1702c8b47c31",
            "text": [
                "my inner demons"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "1461a625-9aec-4bd5-968c-b165682fa2a6",
            "text": [
                "porn stars"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1495108e-b673-4fd8-9d90-3d2dab87fa06",
            "text": [
                "passive-aggressive Post-it notes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1544142a-3d99-4b3d-96f0-67e1308d90a5",
            "text": [
                "a can of whoop-ass"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "161c74d2-7438-4e12-8838-c2f5e6df359b",
            "text": [
                "the Tempur-Pedic\u00ae Swedish Sleep System\u2122"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "17e321fa-f7d9-4490-a50d-d646b720834c",
            "text": [
                "licking things to claim them as your own"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "180446e8-6b4d-4b35-a22e-9284771290b1",
            "text": [
                "geese"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "188bae14-4ff1-4c91-b032-97cc48e9896b",
            "text": [
                "hormone injections"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "19a69f0c-733d-423b-9edc-dbb5287ae0ae",
            "text": [
                "the milk man"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "19ebdc64-8099-43da-9123-b5e983a0d8d1",
            "text": [
                "eugenics"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "1bfb9ea3-fba7-4aaf-bb50-de00df5f5844",
            "text": [
                "firing a rifle into the air while balls deep in a squealing hog"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1c70b440-200f-4fbf-9379-4dd5d514cb27",
            "text": [
                "guys who don't call"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "1ce4e66b-3afe-47fb-8e06-fe900dc3d6cf",
            "text": [
                "horrifying laser hair removal accidents"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "1d0d7c3a-c839-4e5d-b6a5-e6ecbe29f9f2",
            "text": [
                "date rape"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1d6c8494-ab79-4c9f-bae4-fae3093802cf",
            "text": [
                "the Hustle"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "1d946d4f-a687-43da-8e13-b21685ffc50f",
            "text": [
                "William Shatner"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "1e2bbdf8-57a1-45f6-b2c9-1b14f35d9ae4",
            "text": [
                "estrogen"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "1e698ddc-afc4-47db-8a51-2ee00fc29466",
            "text": [
                "not giving a shit about the Third World"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "1f7b7bfb-73ba-49e6-a186-a6de69dac4e1",
            "text": [
                "a fetus"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "20bad2ce-b59e-4159-83f8-785341914e6d",
            "text": [
                "poor people"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "212a67cb-9120-4e08-9156-24996ca39761",
            "text": [
                "a sea of troubles"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "215402d7-39c9-4ab1-b1bf-e34cf009b9e5",
            "text": [
                "my vagina"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "2160c54b-3587-459d-bde4-ab456886022d",
            "text": [
                "heartwarming orphans"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "21e1f302-34be-4237-8046-84c9ccfef322",
            "text": [
                "flying sex snakes"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "221107e3-c4d9-4d55-9c34-88af541c44ed",
            "text": [
                "breaking out into song and dance"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "2315335a-4414-411a-aa26-fde813e17ce1",
            "text": [
                "preteens"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "23701b5d-3733-4c96-b262-bf4589bcf833",
            "text": [
                "authentic Mexican cuisine"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "24be2472-dc69-44cb-8f73-dda844eaae14",
            "text": [
                "Euphoria\u2122 by Calvin Klein"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "254fa694-0068-42ba-880d-030ce176dca1",
            "text": [
                "spectacular abs"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "25fc01e0-7d70-4aee-bdef-9c5ac8166da1",
            "text": [
                "booby-trapping the house to foil burglars"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "266683ab-5a58-431d-93a3-0be290c166e7",
            "text": [
                "ethnic cleansing"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "26a7e3c6-713f-4c26-845e-52e57ddff6fc",
            "text": [
                "Christopher Walken"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "26bbfffc-38ff-4468-8c2f-2eae4e3426ad",
            "text": [
                "cybernetic enhancements"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "272beb68-8ed4-4b5f-ada4-4c8a09db4b47",
            "text": [
                "historically black colleges"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "27bd9745-7fe1-48bd-ba96-dbc462148504",
            "text": [
                "roofies"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "28651d17-e665-44ba-a9ee-9530d385ecbd",
            "text": [
                "mouth herpes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "29f51923-05f3-46bb-b999-3fb45b2a8da8",
            "text": [
                "an Oedipus complex"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "2bcc5ac9-b4e2-4fc3-a9d3-8416ba7edd4e",
            "text": [
                "sexual tension"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "2c8587ae-447b-4b27-9d9a-eeda444f1bf4",
            "text": [
                "a sad handjob"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "2cf76ee1-c70f-4f9f-9c01-b165c68a46f3",
            "text": [
                "intelligent design"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "2cffb493-66d0-45f7-bf09-78dd1c99edab",
            "text": [
                "Cards Against Humanity"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "2d0a14ab-4b42-4673-863c-707a981a0933",
            "text": [
                "third base"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "2d5ce7b0-c668-49ad-a042-d772cae9e930",
            "text": [
                "mathletes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "2e7f2e31-575d-4a69-a182-ba0a496959ba",
            "text": [
                "road head"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "2ef17283-58cf-4375-9ee5-48c6bb8383f2",
            "text": [
                "Kanye West"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "3140bc67-ce94-4a54-9081-44aa34b48210",
            "text": [
                "a micropenis"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "323efac0-5b46-49cb-8c48-db934da7295a",
            "text": [
                "dying of dysentery"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "324b369b-7b0f-4572-abe1-5a86b89210ce",
            "text": [
                "AXE Body Spray"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "32ceb2cf-00e4-4511-b9bd-173419fb22f8",
            "text": [
                "a foul mouth"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "32d38d97-0c01-424c-a4d5-9da327219015",
            "text": [
                "tweeting"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "337d00e0-0d95-4dbc-a0d1-c76367647160",
            "text": [
                "tentacle porn"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "33d4aa41-4fca-4ca7-b549-9415579d92bb",
            "text": [
                "another goddamn vampire movie"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "33ef5058-8f63-4e23-81b5-7ff6cbf7798c",
            "text": [
                "women's suffrage"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "342e2393-9c4c-4d72-849e-ab3c0a10a7aa",
            "text": [
                "the hardworking Mexican"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "348576fa-8e6d-4f96-84da-612a89d2ae47",
            "text": [
                "catapults"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "34cf41b5-7c2d-4d3a-bbf1-e4f334fa65a5",
            "text": [
                "a snapping turtle biting the tip of your penis"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "34ee9e79-4957-4b1e-9429-6ea811edb7ee",
            "text": [
                "flying sex snakes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "367bd6dc-ca60-49ff-92a3-8a6534d09df1",
            "text": [
                "The Rapture"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "377cc30b-e33e-43b4-9fb2-33cd3e3158f9",
            "text": [
                "not reciprocating oral sex"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "379b9428-7839-4382-89af-dab93235c56f",
            "text": [
                "picking up girls at the abortion clinic"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "37db3750-ba47-45f0-9588-be5d2183b7ee",
            "text": [
                "a zesty breakfast burrito"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "39913cd8-4803-4675-9380-bed03b381af4",
            "text": [
                "Sean Penn"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3a0c0cde-2ccf-4b4e-a1c3-5575bbebe747",
            "text": [
                "nipple blades"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3a6b285c-f886-4898-9a4b-e718c0870cb3",
            "text": [
                "Toni Morrison's vagina"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3aedf07f-c344-4275-8886-67724f5b7b35",
            "text": [
                "cuddling"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "3b3d1c6d-d8fb-4785-af95-447c5291bda4",
            "text": [
                "Sean Connery"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "3d4382d2-bec6-4818-9bb8-808e283f27cd",
            "text": [
                "a disappointing birthday party"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "3d5e1ba7-af8e-4f50-988a-0f77688d461e",
            "text": [
                "raping and pillaging"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "3dd042af-8d5b-44fb-b553-0616710c9618",
            "text": [
                "consultants"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "3e05bebf-b72a-4901-b7fb-922553005e5b",
            "text": [
                "Judge Judy"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3e1c0387-6e6b-44fa-aba8-328ae50386c8",
            "text": [
                "team-building exercises"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3e6dbc5f-0744-420d-bf98-054789e33ff1",
            "text": [
                "serfdom"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3ead9276-03bd-4d99-a069-5393af6c1f2c",
            "text": [
                "exactly what you'd expect"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3ec1609b-af11-4bcc-8679-bdd2058471e3",
            "text": [
                "pixelated bukkake"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3f53e36a-f3d1-4b1b-99f2-77889595e9d4",
            "text": [
                "Viagra\u00ae"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "3feedfa1-facb-43df-873e-d3c6b584c106",
            "text": [
                "Asians who aren't good at math"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "40c2f602-6657-48b8-a4a1-f93ab6576a6b",
            "text": [
                "multiple stab wounds"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "415e33a7-b6b9-49a0-b9e9-3afe9f790a58",
            "text": [
                "me time"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "41e90e99-beeb-4227-88a1-96a5e65019db",
            "text": [
                "the miracle of childbirth"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "420b33a3-0f86-4a60-880d-beaa5567852c",
            "text": [
                "teaching a robot to love"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "4220d505-4995-4592-9fba-ce6e2dffd1a1",
            "text": [
                "homeless people"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "433b3193-72f7-41d9-9772-813f84903d50",
            "text": [
                "global warming"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "43b1ad34-294b-422e-89e0-c450ac48d6b9",
            "text": [
                "agriculture"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "441ff3b9-395e-4f08-8dc7-25e136a83aa0",
            "text": [
                "Lady Gaga"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "442c1aa7-e753-4e97-8f4b-6ead4b46d37c",
            "text": [
                "hot cheese"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "4649ed94-002c-41a6-93d8-f6b13f6b5e9f",
            "text": [
                "Skeletor"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "46c40963-3075-498b-9aa1-8de8f1e2d049",
            "text": [
                "Jewish fraternities"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "478f2eb9-568d-46e6-9d0a-474b2742f60c",
            "text": [
                "Adderall\u2122"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "481a3c8c-8eb9-4bd1-af0e-6072cce1153d",
            "text": [
                "obesity"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "48669d51-a185-4876-9edb-277fd40dbb81",
            "text": [
                "the Trail of Tears"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "48761a0a-4885-456b-b1b6-8b2db43ece68",
            "text": [
                "the Dance of the Sugar Plum Fairy"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "48a4eb5f-6acf-45e4-a8c8-b5813fc3316a",
            "text": [
                "gloryholes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "49ba16f1-184e-4a1a-945a-11bc1f4eacd3",
            "text": [
                "object permanence"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "4a979f54-3a95-461a-85d2-f5602c2c62da",
            "text": [
                "her Royal Highness, Queen Elizabeth II"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "4b828e9b-0434-40d3-bec9-74b44c65e810",
            "text": [
                "land mines"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "4bef6640-b4aa-4459-8594-a77f445bb36f",
            "text": [
                "fingering"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "4cb194e1-3f39-4d94-8645-4e4009ffe8e9",
            "text": [
                "tasteful sideboob"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "4cb7e03a-9da5-47dc-b0ea-ef26a980a1e2",
            "text": [
                "altar boys"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "4cfdba42-a741-4f61-bc96-40c6cb9201e9",
            "text": [
                "a brain tumor"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "4e4852d2-5015-440e-b83f-c87ad946c857",
            "text": [
                "a defective condom"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "4f2e762d-4792-40a4-adc0-fce260616020",
            "text": [
                "puberty"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "4f67cfab-f2ea-4616-a957-f37e24c72c51",
            "text": [
                "the heart of a child"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5017734f-2052-4a30-928c-9db26bc7143a",
            "text": [
                "half-assed foreplay"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5162648c-ac39-4ad2-9086-78eefb8566ee",
            "text": [
                "cockfights"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "51c0c801-7ea3-45f1-8082-8c2c69994bf4",
            "text": [
                "taking off your shirt"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "52a55dc9-d716-453a-8ea0-ec297df2da52",
            "text": [
                "eating the last known bison"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "52fb0fa3-78ad-46ed-8e20-2d59f8221cae",
            "text": [
                "uppercuts"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "530e1d0b-0285-4a5d-9bc7-24305b2203f5",
            "text": [
                "flesh-eating bacteria"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "55ece173-6f16-4aa9-a48f-7ca5d7966bd4",
            "text": [
                "racism"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "56bd41ac-46b3-46cc-a1f5-06b5b022b553",
            "text": [
                "scalping"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "56f43fab-6331-4442-8bd3-8e81203a1bd2",
            "text": [
                "wiping her butt"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "57d62022-4077-4447-ae56-f4e99653472a",
            "text": [
                "bees?"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "5978ae75-2e34-4a99-ab75-c458d43a38b3",
            "text": [
                "emotions"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "59c2b9ce-464a-4193-bec8-a38e364474f8",
            "text": [
                "balls"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5aaf624a-1a5e-42af-bda8-ff6c5f6b2e5c",
            "text": [
                "sexy pillow fights"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5b67876a-b923-471f-bc20-0e0fbd6eca0b",
            "text": [
                "a mopey zoo lion"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5b7e0087-adc8-473f-b3d0-e2f5fa2812a4",
            "text": [
                "Harry Potter erotica"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5ce1836a-cbcd-4e35-b987-6548fad1e9cc",
            "text": [
                "concealing a boner"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "5d3d41ea-c13b-4547-b6f0-c8821620cb3b",
            "text": [
                "yeast"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5d42b4e3-51c7-4904-8d67-16bb126bef9c",
            "text": [
                "michelle Obama's arms"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "5d6d3f4e-a827-409d-9df3-d60f256a01d9",
            "text": [
                "a death ray"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5da3d29f-6e80-4f0e-86ab-aca205ff0197",
            "text": [
                "American Gladiators"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "5dca37ee-4cc9-4ea9-9ec6-cbb248fd0bdb",
            "text": [
                "a drive-by shooting"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "5e284278-d54d-43e2-b559-db6753494c04",
            "text": [
                "stranger danger"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "5eb4fb55-bb5c-4f58-adad-a5fd626409f3",
            "text": [
                "the Donald Trump Seal of Approval\u2122"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "5fa78fab-7765-4dcd-b7ae-a3fd31429cf7",
            "text": [
                "boogers"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "61c5ad99-0439-4e5e-bc58-1dac91fe7e13",
            "text": [
                "Nicolas Cage"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "634b1935-ab29-4f09-a4ce-16894bc04e3c",
            "text": [
                "smegma"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6350ce1c-f679-4b6b-b340-5c5e2bb69e11",
            "text": [
                "copping a feel"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "639b2870-72b4-41aa-8e39-2c948d6eed8b",
            "text": [
                "surprise sex"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "63c969f1-6761-4f77-897e-862f79a9a378",
            "text": [
                "elderly Japanese men"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "63e42f83-3dde-46c7-b5cd-8dea423ce77d",
            "text": [
                "police brutality"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "6415646a-f239-4ca7-baca-c43570122ac6",
            "text": [
                "active listening"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6418579d-a9c7-45f5-87dd-4ab8299870fb",
            "text": [
                "civilian casualties"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "64740120-cc6d-462d-b94a-3f81b67a392e",
            "text": [
                "a time travel paradox"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "649a5601-30e4-490d-a90a-eddad0ca62a9",
            "text": [
                "Darth Vader"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "64a4ff2f-e757-4ae9-8ec1-c95c727173a1",
            "text": [
                "getting so angry that you pop a boner"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "65a7086c-1ac8-48f0-aab6-17d45fba918d",
            "text": [
                "masturbation"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "66cb150b-9369-44a3-b601-d77f8e1bf705",
            "text": [
                "an erection that lasts longer than four hours"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "678aa74d-1f41-47ac-aaaa-cca78ca74415",
            "text": [
                "too much hair gel"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "694ffddc-3526-4b73-80df-6ad4e894d8c9",
            "text": [
                "vehicular manslaughter"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "69d441a7-a900-4cd2-804c-01d678cdf7cd",
            "text": [
                "the placenta"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6a08150f-c494-4165-889b-9ae420eef6dc",
            "text": [
                "jibber-jabber"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "6a3811d3-5948-4135-8c6f-6eb1dc17259a",
            "text": [
                "being on fire"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "6b44681b-b8da-4a3d-bcc3-856117df9059",
            "text": [
                "a tiny horse"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6b978ef0-bb43-462e-8733-ccaf44ff1fa1",
            "text": [
                "winking at old people"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6c2c7e0d-b325-42e6-84fa-4f6a800c4463",
            "text": [
                "overcompensation"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6ca0a77e-bbef-417a-a6e1-6030aa1af293",
            "text": [
                "Lance Armstrong's missing testicle"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6d89377e-24d4-48e0-aa2c-6c5a1b534fe7",
            "text": [
                "a bleached asshole"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "6e0dd9d2-6028-4bb2-aacf-3f7dc5e824b2",
            "text": [
                "the inevitable heat death of the universe"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6e70a848-1ed4-44e2-a5ff-48c33833e5c7",
            "text": [
                "ghosts"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6efdbcae-b5e2-422c-adac-32aa2e0fa7cd",
            "text": [
                "Lunchables\u2122"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6f2ef35c-7dca-4ae5-a63a-fce289456743",
            "text": [
                "nocturnal emissions"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "6f3b9943-7640-4c91-af0f-ca8e1c155cd2",
            "text": [
                "saxophone solos"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "6f469ab9-567a-45d8-8545-b5c5c4e99823",
            "text": [
                "vikings"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "6fee2cc1-4925-48cc-a5e7-126ddcfc100e",
            "text": [
                "Sarah Palin"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "7145a86a-e162-4043-af1c-823bf423bd74",
            "text": [
                "72 virgins"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "7165afbc-8b1a-47bc-b587-3fcbaad547cc",
            "text": [
                "the Underground Railroad"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "718af18d-1a09-4bc7-94e4-452caa6758d8",
            "text": [
                "expecting a burp and vomiting on the floor"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "71950898-310b-43a1-9f42-ce28f6c9a4fa",
            "text": [
                "soiling oneself"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "7201ac6d-7584-4c0a-aed5-baf0fa4c4090",
            "text": [
                "wifely duties"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "720e8654-c915-4620-89af-412c2a91bad2",
            "text": [
                "charisma"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "7278ce44-e508-40ec-9537-c8df4c9f7342",
            "text": [
                "Genghis Khan"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "729ddf47-8a32-4780-873d-113fa8bb36de",
            "text": [
                "sniffing glue"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "72fc5e9a-5326-4c35-9430-6598370dda58",
            "text": [
                "friction"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "731cda5b-a233-4960-8e73-6fcfb3a5953d",
            "text": [
                "lockjaw"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "73535dce-977b-4195-bfa1-43725b4b056c",
            "text": [
                "the Amish"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "7362cde1-9a0a-425c-b2ac-b8ff1b81d7d5",
            "text": [
                "a thermonuclear detonation"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "740e9cfd-b53c-4eca-b95a-6f56515045dd",
            "text": [
                "mutually-assured destruction"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "74ecb0cf-8fac-4669-8b50-7bd2b4bad53b",
            "text": [
                "dry heaving"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "7606c153-c4bb-43df-8beb-45d71a083a53",
            "text": [
                "a really cool hat"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "77868a73-4a1d-4cf6-a9d8-11a6d29ad07c",
            "text": [
                "Republicans"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "7a02d98b-b15c-4203-8218-1be7a99d9859",
            "text": [
                "poorly-timed Holocaust jokes"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "7a69a03a-9f92-496a-ae26-ffe35272646c",
            "text": [
                "my genitals"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "7b24190f-f273-43ee-9e1d-7eeac3acf2d5",
            "text": [
                "the gays"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "7b3d4059-6f28-4ea7-8926-953f4ae25927",
            "text": [
                "Count Chocula"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "7b557be2-4e1a-4077-9134-40558613d01c",
            "text": [
                "oversized lollipops"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "7b84147e-5985-4916-9eac-6c3f62a154f3",
            "text": [
                "farting and walking away"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "7b87976c-f48d-479b-a05b-39bb36a3b495",
            "text": [
                "my sex life"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "7d2faccf-eed7-4dac-9c20-009565e829c4",
            "text": [
                "goats eating cans"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "7e4caf32-1181-4fe6-8802-cf2a4a5fad16",
            "text": [
                "a cooler full of organs"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "802eb670-9ca5-4abc-82d0-a1ae6e3a18f2",
            "text": [
                "finger painting"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "805b8566-4e85-4a6e-b79c-daf19f0ea28b",
            "text": [
                "Muhammad (Praise Be Unto Him)"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "80c09d38-bc34-4b1d-ace9-660b11ebb5ed",
            "text": [
                "Fancy Feast\u00ae"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "80c77cac-7a82-4d4b-9a1c-e9d076e5ef07",
            "text": [
                "explosions"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "81a11045-2df4-4579-bba6-523852752e75",
            "text": [
                "testicular torsion"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "820e72bb-bf87-41c3-945f-b8782dff8350",
            "text": [
                "pictures of boobs"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8283a426-2378-4337-87f3-6c2a23e4056f",
            "text": [
                "an asymmetric boob job"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "829405db-97c7-4be3-9783-4b3717b23069",
            "text": [
                "a good sniff"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "831c6e4b-b4cd-4c74-a27e-b70f78624048",
            "text": [
                "flash flooding"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "83f3ce7b-571f-4688-b127-ded5176f7318",
            "text": [
                "leaving an awkward voicemail"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "8437e157-2110-4825-bcf8-6370af92a837",
            "text": [
                "tangled Slinkys"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "84ae1b96-3f3a-48c8-93e8-37100650bf5d",
            "text": [
                "pretending to care"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "84bafec6-4ab9-4fde-a97a-49b3a21de0cb",
            "text": [
                "teenage pregnancy"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "84c9f6d0-b3ec-457f-9e2b-ea20cd0fb188",
            "text": [
                "a hot mess"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "85a69264-a034-47bb-8c11-b4e41f290294",
            "text": [
                "repression"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "85b45d89-614e-43db-9dc9-0bafa95bc24a",
            "text": [
                "dying"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "85b6ddd3-256b-435e-a2b7-6ebf72aef083",
            "text": [
                "giving 110%"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "867cf63c-e463-48e0-a318-17ec5ded7928",
            "text": [
                "seppuku"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "875d3ab3-a422-4cbf-99ea-afdb1047a7d9",
            "text": [
                "my collection of high-tech sex toys"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "880e8e3d-7066-4f11-97e6-344c2729bb22",
            "text": [
                "vigorous jazz hands"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "88292d46-cb61-47c4-ba4e-15c74de64a86",
            "text": [
                "embryonic stem cells"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "882bf18c-07ac-4e58-8914-7873d2caf05e",
            "text": [
                "dick fingers"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "88b5b3e9-c96e-47ad-a09a-80d7851b8383",
            "text": [
                "Tom Cruise"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "88d04d44-914d-4622-8f30-efaf033a2793",
            "text": [
                "feeding Rosie O'Donnell"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "88e191b0-661a-41df-8f1a-c332c6d5a74d",
            "text": [
                "vigilante justice"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "898331ed-5a58-44f4-8455-3e765f1b2129",
            "text": [
                "getting really high"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "8986e730-7e46-435a-a6ab-1bff4a6fe4a2",
            "text": [
                "Italians"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "8b6d2e3a-fe44-4eb5-8bf9-7a0f8182ec49",
            "text": [
                "re-gifting"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "8b88aaf0-7036-4a9e-8f94-251a97bc4431",
            "text": [
                "The American Dream"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "8c8fad23-4e71-4dc7-93c1-f593d035c5ff",
            "text": [
                "swooping"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "8d04d3f1-0ddb-4e98-9949-4928bcb50c72",
            "text": [
                "cheating in the Special Olympics"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "8dbc7a89-c55f-413c-a405-ba2f8d3e0bf9",
            "text": [
                "keg stands"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "8de95d07-b546-4f72-9028-8fcbc0dcd809",
            "text": [
                "puppies"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "8e08f75f-5da3-41a4-b160-f357420cf4ab",
            "text": [
                "the folly of man"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "8ecf47c4-6a0a-4fee-b7db-cc7f61069807",
            "text": [
                "AIDS"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "8f2d8915-5ad7-4f70-95c6-0d047c0d8533",
            "text": [
                "a big hoopla about nothing"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "8f43bd06-47ce-4884-adcf-12d18f64417e",
            "text": [
                "the Chinese gymnastics team"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8f5b92f0-a1fe-4693-a982-fb8346c02491",
            "text": [
                "the terrorists"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "8feba85d-f5e9-4828-9d4a-270ab25e1ed2",
            "text": [
                "a sausage festival"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "90c82ace-8ab9-4608-8e93-8dd2323eafc1",
            "text": [
                "being rich"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "91105a1f-a12b-488c-a8a2-a8dd7a6d795e",
            "text": [
                "the Kool-Aid Man"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "91455996-8268-4ff9-9228-9bb36e4464f1",
            "text": [
                "Mr. Clean, right behind you"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "9153c46f-56e3-4baa-915a-9a7e4bf4b65b",
            "text": [
                "famine"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "91737d55-dd9c-4c40-bf44-3181f56ee1af",
            "text": [
                "home video of Oprah sobbing into a Lean Cuisine\u00ae"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "917fc5df-4d21-419f-9756-159d3b2ce0e4",
            "text": [
                "passing a kidney stone"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "91ba6077-a0c3-464f-86ae-8ca846fb8897",
            "text": [
                "the taint; the grundle; the fleshy fun-bridge"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "91e00024-57b8-405c-89ad-cf09eb978b92",
            "text": [
                "dental dams"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "91e7bf73-a328-4351-aab9-9bf2b66456df",
            "text": [
                "jerking off into a pool of children's tears"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "92639dde-2f28-4b12-a3f1-4ab3d517c55f",
            "text": [
                "menstruation"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "938c42f8-5ad7-4009-98de-76cd94223bf9",
            "text": [
                "Glenn Beck catching his scrotum on a curtain hook"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "93977f6b-a563-4587-a016-c97c25edac5c",
            "text": [
                "soup that is too hot"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "94700992-6d6b-4bc6-914f-7e758ff2cd98",
            "text": [
                "friendly fire"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "9678478e-6af0-4aa9-af11-7b2e87791679",
            "text": [
                "bingeing and purging"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "97392ffe-0e9b-4cfe-a5e0-a71dfdea0f28",
            "text": [
                "smallpox blankets"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "980b621f-2640-4988-b4f7-373e799c7fa7",
            "text": [
                "sexting"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "98387753-65c3-42ec-b1b8-372ae9439a00",
            "text": [
                "old-people smell"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "987eade9-a2bc-4af2-890c-8f408d8b53e0",
            "text": [
                "the Jews"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "9911921d-06f0-4344-b593-ebb67937c1df",
            "text": [
                "golden showers"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "99f440c1-a83e-477a-8df4-fb91867442d4",
            "text": [
                "horse meat"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "9c0ea9bf-85f5-44d9-a551-968929074e94",
            "text": [
                "Morgan Freeman's voice"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "9ca716a4-0d91-43f7-b823-0ecad1f4e769",
            "text": [
                "unfathomable stupidity"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "9cf46dd7-4cb4-4435-9b23-26299aa87502",
            "text": [
                "foreskin"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "9da37c21-1aab-4f05-9aba-0823aace70c9",
            "text": [
                "Gandhi"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "9ed9f435-2e61-4667-9114-f3bd98db47e4",
            "text": [
                "raptor attacks"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "9efb85cc-14e6-49d3-9657-d97726ae95b1",
            "text": [
                "dropping a chandelier on your enemies and riding the rope up"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "9f13b316-47ee-496f-853a-110a0a684053",
            "text": [
                "making a pouty face"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "a0124e75-5bf2-48f9-9351-e4d762d61308",
            "text": [
                "when you fart and a little bit comes out"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "a274a42f-3c96-408c-9cce-644378827fa2",
            "text": [
                "Five-Dollar Footlongs\u2122"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a3912894-9a12-45af-988b-d0df25f1d9fa",
            "text": [
                "eating all of the cookies before the AIDS bake-sale"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a44cd7f6-6aaa-4376-89a7-cf07381c821c",
            "text": [
                "Arnold Schwarzenegger"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a4b3390e-9a88-4647-98ed-76ababd9032a",
            "text": [
                "coat hanger abortions"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "a4e0f2a9-0c22-474d-81bb-89a5158bd8e7",
            "text": [
                "opposable thumbs"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a509de1b-9f16-4421-83db-76c7612b24d2",
            "text": [
                "poor life choices"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a5361470-dfd8-485c-a771-c3d3a6fa0190",
            "text": [
                "my soul"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a6cab55f-8ebe-4f46-a6fe-8fb6c8ef2bfe",
            "text": [
                "Jew-fros"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a6f52c8e-4b86-42a0-ad48-b25f143810d6",
            "text": [
                "the token minority"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "a830d14b-eed8-4ba2-bcc0-e4a989fd6d2e",
            "text": [
                "Michael Jackson"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a86b62e7-78be-4726-8bb8-aafff638bb50",
            "text": [
                "Barack Obama"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a972ebff-b420-4009-b43c-2ac081d41a4d",
            "text": [
                "natural male enhancement"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "a9881510-09f0-48d5-8e9b-21ab8929ff0a",
            "text": [
                "same-sex ice dancing"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "a9c0705e-e0bb-4a4b-917d-f8a2ae414cd6",
            "text": [
                "waiting 'til marriage"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "aaf0e2ff-b41f-41bf-adb5-b22e6c40755d",
            "text": [
                "a clandestine butt scratch"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "abc150c3-2015-42bc-9bc2-d4c317d98b0b",
            "text": [
                "being fabulous"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ac175fb2-cd39-4756-82e2-4f2a36d7991e",
            "text": [
                "men"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "ac2b1a23-0d46-4a4d-bfe1-ccdd704fd9f6",
            "text": [
                "the clitoris"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ac2bc327-3d17-490e-97e2-8db05b884654",
            "text": [
                "college"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ad20c3af-8919-4f46-85e4-abdd2fd2260a",
            "text": [
                "natural selection"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "adaddd20-4221-4568-a259-efe223d92fb7",
            "text": [
                "Domino's\u2122 Oreo\u2122 Dessert Pizza"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ade1b637-25b9-4562-a402-6e9ae7072172",
            "text": [
                "friends who eat all the snacks"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b0491f38-a5f3-411f-a52f-dc7b53b6f80c",
            "text": [
                "queefing"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b2136c00-7106-434b-a11e-36bc40fc85e1",
            "text": [
                "inappropriate yodeling"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b25094f9-5c25-4e14-8547-58df3a963b04",
            "text": [
                "the Virginia Tech Massacre"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b2701814-4bbe-4e26-a4f9-063655e18858",
            "text": [
                "actually taking candy from a baby"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b285cc05-ba59-4132-b1e4-c99e3b061ec6",
            "text": [
                "BATMAN!!"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b33fb924-79b6-453b-869c-657d6195969a",
            "text": [
                "the glass ceiling"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b40c74e2-f781-4ce5-85dd-d213f88efe6f",
            "text": [
                "kamikaze pilots"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "b4340500-72f1-408d-970b-f1264a45813c",
            "text": [
                "pooping back and forth. Forever"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b51c7deb-909c-4847-ac94-d56cfcf54e91",
            "text": [
                "the World of Warcraft"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b7af6eef-8381-4a04-8b87-9a5e0808e7ca",
            "text": [
                "stifling a giggle at the mention of Hutus and Tutsis"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "b7c08505-eb90-4434-a6be-d56b56cdf56a",
            "text": [
                "child abuse"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b88bce84-3859-426f-be20-54e75cac0beb",
            "text": [
                "crystal meth"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b88c4eaf-5982-4448-9fb4-8484a56bb7e7",
            "text": [
                "New Age music"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b8bfe106-e57b-4139-a69a-e6b836fc48d2",
            "text": [
                "the Holy Bible"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "b98f6036-1173-4079-8d20-09413b6f8d70",
            "text": [
                "an honest cop with nothing left to lose"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "b9e28ce1-9da6-40c1-af31-6f032a55f1f1",
            "text": [
                "the forbidden fruit"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "ba125874-08b8-463a-9342-a3a70268a8c9",
            "text": [
                "grandma"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "baa63c79-abd6-4379-bdb9-722ff767ec43",
            "text": [
                "alcoholism"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "bad6a60e-deed-41fb-9025-c9096fc7097e",
            "text": [
                "the South"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "bb5c0734-fd17-4b8f-902e-ffee3d7a929a",
            "text": [
                "MechaHitler"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bb61c3e3-e317-4968-951f-84a2904b525b",
            "text": [
                "forgetting the Alamo"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "bb6b323c-3470-4f14-8899-690a841249ff",
            "text": [
                "incest"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bbc3cd25-a5bf-4882-a9e9-cd8df5d3d8f7",
            "text": [
                "Nickelback"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bc435db7-d2e9-49fb-b514-8437d4558992",
            "text": [
                "two midgets shitting into a bucket"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bc5c9fc4-ab75-45f7-a20d-6dfe0e5cd696",
            "text": [
                "doing the right thing"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bed09494-8b86-4e66-b914-b0593639d4a0",
            "text": [
                "the profoundly handicapped"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bed6b9fe-0785-401e-a44d-87f3f286ea14",
            "text": [
                "a middle-aged man on roller skates"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "bef75622-6576-4bc0-a865-1e6fd796de92",
            "text": [
                "public ridicule"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "bfffc4f0-b37a-4be5-b372-4bc388cd16f4",
            "text": [
                "dead babies"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "c19a7860-4e29-4031-a5a9-20f0c942c380",
            "text": [
                "crippling debt"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "c1d558d8-1b85-44fb-b41c-8a0c93914af4",
            "text": [
                "amputees"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "c1ddc33d-084c-4a97-a742-70d6bbcc2ebe",
            "text": [
                "a moment of silence"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c229eb0e-5946-4155-be7e-b9c7d1b85b50",
            "text": [
                "Pac-Man uncontrollably guzzling cum"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c3dd3a4c-fa1e-46e9-8d4e-af1ddc5f5796",
            "text": [
                "the Hamburglar"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c3e152e5-13fd-4a4b-8ecc-31ed7e60c54b",
            "text": [
                "shapeshifters"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c3fb39b5-abb2-47b5-8f66-ed544f312813",
            "text": [
                "Bill Nye the Science Guy"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c4239ccf-41cb-463f-a446-11b159d9a394",
            "text": [
                "laying an egg"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c424708e-ebe7-495e-bb81-e9bf216770e8",
            "text": [
                "assless chaps"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c5d04eb8-5740-48e8-b086-3aba3905df39",
            "text": [
                "heteronormativity"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "c641972a-9982-4d73-ae5c-709ffb8626da",
            "text": [
                "getting drunk on mouthwash"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "c6c7db54-fd2d-4bcc-9b94-b4fe802d3eba",
            "text": [
                "the true meaning of Christmas"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c6f0b1d2-f76a-42ea-b38f-55c92d93db4a",
            "text": [
                "a monkey smoking a cigar"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c76ef935-f197-4dd6-bb0e-6f142f79d9b9",
            "text": [
                "Auschwitz"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c7df89b5-9123-4ece-a79a-02b28381b082",
            "text": [
                "fiery poops"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "c7ff1a57-f17e-47f9-852f-9068658679b7",
            "text": [
                "a sassy black woman"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c87cc63f-d494-464e-b30d-d065b7bc3a77",
            "text": [
                "white privilege"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c96391ea-35c0-4f19-8b72-2fb3fb61418c",
            "text": [
                "erectile dysfunction"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "c96962e2-748d-492d-b708-2516f3b61218",
            "text": [
                "goblins"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ca34828d-396d-4024-9200-0ccbc8c0c451",
            "text": [
                "wearing underwear inside-out to avoid doing laundry"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ca78e5d7-3f72-4585-a3cd-abf43e694a48",
            "text": [
                "a stray pube"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "caa67c44-d35a-4223-843b-b8bcd38d2ded",
            "text": [
                "prancing"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "cad6bb2f-eef1-415f-a533-5fd662d22445",
            "text": [
                "Dick Cheney"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "cb34e11d-e5e0-404e-8ccb-36883e2bdfe2",
            "text": [
                "a falcon with a cap on its head"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "cbcf15bd-6716-438b-b0ad-0e8cc763481a",
            "text": [
                "a homoerotic volleyball montage"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "cbffa120-2062-4c60-a4d7-210097fe6319",
            "text": [
                "an icepick lobotomy"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "cc8c7c3a-5cd6-4973-b7c5-51cf85b53e97",
            "text": [
                "an M. Night Shyamalan plot twist"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "cce6e9d6-a9da-4ad7-a84f-3057ae8ba684",
            "text": [
                "German dungeon porn"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "ce3f450a-3485-4386-87cc-697f2e114868",
            "text": [
                "drinking alone"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ce82bf08-c052-4994-8829-699f6304edaa",
            "text": [
                "Hot Pockets\u00ae"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "cef29158-56ce-43ad-a304-152a8110d99c",
            "text": [
                "waterboarding"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "cf6cd651-2751-411d-9e48-8664da9d5f6d",
            "text": [
                "figgy pudding"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "d04fd75e-a007-4435-ab5c-1cff6f70e3a1",
            "text": [
                "scientology"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d0a89cb6-d269-431a-9ecf-b01ab3276e2d",
            "text": [
                "peeing a little bit"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d20e5637-51d9-4b69-92ac-e265d5012540",
            "text": [
                "dwarf tossing"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d21c6e3b-7fec-4e62-a6ea-dceca865a92b",
            "text": [
                "a Bop It\u2122"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d2cf1e39-145d-4bce-942e-b7b9369cd8e6",
            "text": [
                "a gentle caress of the inner thigh"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d2d97acd-26ae-48e1-8956-80300fb987f0",
            "text": [
                "former President George W. Bush"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d31ab5ac-005d-4d37-840e-80c23c309d8f",
            "text": [
                "my relationship status"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d3945a1a-6f2a-42ed-8933-c8666512f4e8",
            "text": [
                "scrubbing under the folds"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d3d02544-2e7c-43e5-a3db-16591c03204a",
            "text": [
                "a balanced breakfast"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d3edb812-e8a1-438b-852b-53a2f2703488",
            "text": [
                "hot people"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "d47ef6dc-0dfc-49d9-aedc-462d27bb2b68",
            "text": [
                "a lifetime of sadness"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "d48ce858-9536-4199-8c9f-21f7ec9610cc",
            "text": [
                "pedophiles"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d49875f0-05e4-4c69-a4bb-914e3d7c2ec1",
            "text": [
                "Glenn Beck convulsively vomiting as a brood of crab spiders hatches in his brain and erupts from his tear ducts"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d5cb953b-154b-4fa2-960f-e9cf64c08880",
            "text": [
                "hope"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d5e91591-d2c2-4ff1-8bd4-b3f8d0d8509a",
            "text": [
                "the Care Bear Stare"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d60f79fd-ca5e-4b37-b132-d4caf4b7e48c",
            "text": [
                "women in yogurt commercials"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d646b169-9ed0-4bf4-9e01-88f6b5cc8bf1",
            "text": [
                "Shaquille O'Neal's acting career"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d6528592-3da2-442c-b5db-822167a4a63a",
            "text": [
                "a mime having a stroke"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "d6b421da-770c-40aa-8bb4-3f438f0c8d50",
            "text": [
                "a salty surprise"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "d719cb55-4c5c-4f4b-865a-51c57d755cf7",
            "text": [
                "Pabst Blue Ribbon"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "d7b86e85-dc17-4f83-8cf7-0bdc37031d1d",
            "text": [
                "the Blood of Christ"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "d9462f9f-2c4e-4059-8882-2f4ba48bcef8",
            "text": [
                "friends with benefits"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "d94a2aaa-2a6e-47bb-b075-d47a2031dea7",
            "text": [
                "the Three-Fifths compromise"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "da06e799-1938-4d66-a9e4-b220f0847809",
            "text": [
                "free samples"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "da1ee698-7a08-4296-b806-5d8ede0625ad",
            "text": [
                "sharing needles"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "da77a46b-9420-4bbb-b2f5-97a6f194022e",
            "text": [
                "dead parents"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "dc31311e-09a9-4ece-8b95-b4158896e396",
            "text": [
                "the Little Engine That Could"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "dc8abbbd-8f88-4bfe-8b47-ee42d0081e95",
            "text": [
                "a look-see"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "dd037acd-5849-4616-9f7d-7fafa516d825",
            "text": [
                "John Wilkes Booth"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "dd96c714-6ab1-4713-b2a6-dc401e82a872",
            "text": [
                "bitches"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ddc8f21b-73db-455d-a753-b99c22dca8ed",
            "text": [
                "lumberjack fantasies"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "defd5c62-68d2-48f2-be3e-1e0db40df067",
            "text": [
                "pulling out"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e01b3d23-21d3-45b5-b61a-86c2ec5ce7d4",
            "text": [
                "all-you-can-eat shrimp for $4.99"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e082c3c9-f0c6-471d-a773-f3b15ca12648",
            "text": [
                "exchanging pleasantries"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e0b1dc15-feac-4d60-986f-9ce6f6214f35",
            "text": [
                "a murder most foul"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e28a2c23-6cf8-4bf8-8798-246f90baf3eb",
            "text": [
                "autocannibalism"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "e29c9fd5-d881-4b76-b317-85b04eb539c8",
            "text": [
                "racially-biased SAT questions"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e2e5ac39-cc42-4bc5-90f5-2abc249ce053",
            "text": [
                "lactation"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e40c51d8-12ed-47da-9f74-e77ae4fac37b",
            "text": [
                "party poopers"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e5c5c010-1960-431d-9e41-f661e3552e60",
            "text": [
                "the \u00dcbermensch"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e6d41849-404f-4491-8a3b-b312046f1e79",
            "text": [
                "Hurricane Katrina"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "e6e24f12-b49b-47de-a5b6-4857a96bb280",
            "text": [
                "self-loathing"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e7693449-6e5c-41e7-8d6b-e4de63568efc",
            "text": [
                "fear itself"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "e7bba33d-c9ee-4ea4-bf50-25e4b14222bd",
            "text": [
                "world peace"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e7e51cad-a911-4aaf-8b2a-a693d83b1182",
            "text": [
                "Britney Spears at 55"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e8bccbaa-d701-4b4e-830a-13df894715eb",
            "text": [
                "riding off into the sunset"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e8c11ba1-1048-468b-9c88-cc563e69b63c",
            "text": [
                "Hulk Hogan"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e8f450ca-ddff-4e2d-96ab-4c9d101af7b6",
            "text": [
                "the chronic"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "e99cf0ee-7e6b-42da-860c-c0127b2df6fc",
            "text": [
                "seduction"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ea021db5-a4dc-40fb-a6a0-cc1096ffa303",
            "text": [
                "the homosexual agenda"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "ea7b2874-3e01-4ab7-900f-4c49267e955c",
            "text": [
                "RoboCop"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "eac29bde-b798-40ff-80b7-353848184ee8",
            "text": [
                "Steven Hawking talking dirty"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "eb6782c9-11c5-460a-9beb-de60d5f246c7",
            "text": [
                "genital piercings"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ebb09941-4282-4421-9c4b-f6ec02efe073",
            "text": [
                "a windmill full of corpses"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "ebb520fa-85cf-4e71-a9ad-4500fee0d98c",
            "text": [
                "passable transvestites"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "ebc1b063-01f3-4b3e-92c1-893e09446e72",
            "text": [
                "a gassy antelope"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ebdbdde4-f3b5-4853-a8cd-2cf0bab702d1",
            "text": [
                "being marginalized"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "ec6b4ce1-fbb5-47d7-bbf3-df211911fa3a",
            "text": [
                "a gypsy curse"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "edc24822-5a51-42f4-af73-b4eaf3e33395",
            "text": [
                "being a motherfucking sorcerer"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "eea51bf6-825e-456d-bbda-940952f19a66",
            "text": [
                "necrophilia"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ef2a917d-5f1a-4b25-b3da-b3aaf698afc0",
            "text": [
                "Justin Bieber"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "ef30f245-f574-4b4c-a552-b8dff96987b9",
            "text": [
                "Natalie Portman"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f02eb329-024b-4240-bc60-e323348ec8be",
            "text": [
                "attitude"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f0387287-9e82-4550-87ae-7cbb8d32b96d",
            "text": [
                "the Make-A-Wish\u00ae Foundation"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f10ad676-cf57-456b-82d1-bd7419ca863d",
            "text": [
                "leprosy"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f1731468-46f1-41f6-b7cd-197d2a20ba7f",
            "text": [
                "penis envy"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f1c07841-6216-4f67-b05c-f7d1c8f88b0b",
            "text": [
                "chainsaws for hands"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f2358c6c-dd75-4f30-96c3-fc691c0ed48b",
            "text": [
                "Robert Downey, Jr"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f23c6a50-7719-4ca1-9544-291c97537ae9",
            "text": [
                "YOU MUST CONSTRUCT ADDITIONAL PYLONS"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f275918e-e85b-42bf-b5fb-c778afa0d4cc",
            "text": [
                "the Big Bang"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f2aa7ca7-6d2a-48ff-93a4-acb3152b010f",
            "text": [
                "sweet, sweet vengeance"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f2f49e0c-4dc1-4a79-a966-ca792564b0f9",
            "text": [
                "child beauty pageants"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f3218f6b-e5d6-4510-be8f-cd6d1d9933e1",
            "text": [
                "getting naked and watching Nickelodeon"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f34248dd-9584-47b2-afae-dd84d413d478",
            "text": [
                "the KKK"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f398f0a1-a7ae-4391-81dd-668d160730f4",
            "text": [
                "man meat"
            ],
            "created_at": "2014-07-10T20:56:27+00:00"
        },
        {
            "id": "f3fef194-8aad-4dc3-bf38-7bb6825072c4",
            "text": [
                "panda sex"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f484ddd8-a5fa-41c1-b3ef-2f29bfdf61b3",
            "text": [
                "Glenn Beck being harried by a swarm of buzzards"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f4cbe5ba-54aa-4b57-8298-2a5690b1d12b",
            "text": [
                "the Force"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f5940dc4-ea1c-4bdf-9bca-a16b5cf660b8",
            "text": [
                "pterodactyl eggs"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f595e007-2e8d-46b1-8df9-c0cfcdedb1b6",
            "text": [
                "sperm whales"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f618535c-b6a4-4fbb-b277-a3e452ce1731",
            "text": [
                "take-backsies"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f6b9bf43-ebe1-479c-b0ec-cc82f9a1e408",
            "text": [
                "a mating display"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f741dd39-ee5c-4ba3-b71e-efac37fb13be",
            "text": [
                "frolicking"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "f8ff10c6-edfd-46b8-b369-691d522d47a0",
            "text": [
                "edible underpants"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "f9db799e-fe71-4f21-89ba-90d6d16b99bc",
            "text": [
                "powerful thighs"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "fb974bb1-2b28-4407-84b7-98c0159aeae8",
            "text": [
                "white people"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "fc5b20cd-5242-41d5-83c5-859ad5459285",
            "text": [
                "anal beads"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "fc713dac-2078-493a-a218-9c8b6066d19a",
            "text": [
                "Kim Jong-il"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "fc8478fe-80cd-4c2a-8d93-35d2b096ece7",
            "text": [
                "8 oz. of sweet Mexican black-tar heroin"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "fceb0365-b19b-4423-9898-03c3dda4766c",
            "text": [
                "grave robbing"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        },
        {
            "id": "fcf4be62-62b4-41f8-8508-dece81d0d5e3",
            "text": [
                "Ronald Reagan"
            ],
            "created_at": "2014-07-10T20:56:25+00:00"
        },
        {
            "id": "fe1648f3-4a19-4780-bd17-1c91f4a5060c",
            "text": [
                "being a dick to children"
            ],
            "created_at": "2014-07-10T20:56:26+00:00"
        }
    ]
};

var summary = {
    "name": "Cards Against Humanity",
    "code": "CAHBS",
    "description": "This is the base set for Cards Against Humanity.\n\nCards Against Humanity is a Trademark of Cards Against Humanity, LLC. Cards Against Humanity is distributed under a Creative Commons BY-NC-SA 2.0 license.",
    "unlisted": false,
    "created_at": "2014-07-09T22:20:08+00:00",
    "updated_at": "2014-07-09T22:20:08+00:00",
    "external_copyright": true,
    "copyright_holder_url": "http:\/\/www.amazon.com\/gp\/product\/B004S8F7QM\/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B004S8F7QM&linkCode=as2&tag=cardcast-20&linkId=NMOTTLY3NJCQGTZX",
    "category": null,
    "author": {
        "id": "1723f71c-129c-44ae-b332-60ab3db14491",
        "username": "CAH"
    },
    "call_count": 90,
    "response_count": 458,
    "rating": "4.4"
};

//----------------------------------------------------------------------------------------------------------------------

// Build a deck object
var deck = {
    baseURL: 'https://api.cardcastgame.com/v1/decks/CAHBS',
    calls: [],
    responses: [],

    // Populate from the summary object
    name: summary.name,
    code: summary.code,
    description: summary.description,
    category: summary.category,
    listed: !summary.unlisted,
    created: new Date(summary.created_at),
    updated: new Date(summary.updated_at),
    rating: summary.rating,
    author: summary.author.username,

    // Populate the cards for this deck
    populatedPromise: Promise.resolve()
};

// Build a list of call cards
deck.calls = _.reduce(cards.calls || [], function(result, cardData)
{
    result.push(new api.cards.Call(cardData));
    return result;
}, []);

// Build a list of response cards
deck.responses = _.reduce(cards.responses || [], function(result, cardData)
{
    result.push(new api.cards.Response(cardData));
    return result;
}, []);

//----------------------------------------------------------------------------------------------------------------------

module.exports = deck;

//----------------------------------------------------------------------------------------------------------------------