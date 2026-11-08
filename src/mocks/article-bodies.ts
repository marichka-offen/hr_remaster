import type { RichText } from '@app-types/content'

// Full-length bodies so the contents list, reading progress, sources and content blocks can be tested
// on real content. Text and data are taken verbatim from the matching mocks in designs/:
// british-regulars-virginia, article-page (Ireland), eighty-years-war-timeline and hussites.

export const virginiaBody: RichText = [
    { type: 'heading', level: 2, text: 'The Call to Arms', id: 'call-to-arms' },
    {
        type: 'paragraph',
        text: 'In late September 1676, the ship Rebecca arrived in London with dispatches from the Vice Governor of Virginia, Sir William Berkeley, with word of a rebellion by the colonists. The Governor, Thomas Lord Culpepper, had been the governor for life since 1675 but had not yet even seen the colony.',
    },
    {
        type: 'paragraph',
        text: "Acting with uncharacteristic speed, by 1 October King Charles II had resolved to send a thousand men to quell the mutineers. For the time, this was a major expedition incurring considerable cost for a government always short of money. Within four more days, commissions for five foot companies — one each from existing standing regiments — were signed, and Jeffreys' Regiment of Foot came into being.",
    },
    {
        type: 'table',
        caption: "Jeffreys' Regiment of Foot — Officer Roster",
        columns: ['Regiment', 'Commander', 'Lieutenant', '2nd Lt.', 'Ensign'],
        rows: [
            ['1st Foot Guards', 'COL Jeffreys', 'Henry Taylor', 'Edward Rous', 'Wm. Matthews'],
            ['2nd Foot Guards', 'MAJ Mutlowe', 'John Tongue', 'Thos. Troutbeck', 'Thos. Seymour'],
            ['1st Foot Guards', 'CPT Picts', 'John Webb', 'John Hetley?', 'Edw. Saville'],
            ["Duke of York's", 'CPT Middleton', 'F. Hobbin?', 'John Thorne', 'John Jeffreys'],
            ['Holland Regt.', 'CPT Meoles', 'Walter Morgan', 'Thos. Sanders', 'George Ange'],
        ],
        note: '5 companies',
    },
    {
        type: 'factCards',
        cards: [
            {
                title: 'Regimental Staff',
                rows: [
                    { label: 'Adjutant', value: 'CPT William Morris' },
                    { label: 'QM & Marshal', value: 'LT John Tongue' },
                    { label: 'Surgeon', value: 'Jonathan Grove' },
                    { label: 'Chaplain', value: 'Paul Williams' },
                    { label: 'Engineer', value: 'James Archer' },
                    { label: 'Commissary', value: 'Thomas Stavely' },
                ],
            },
        ],
    },
    {
        type: 'dataList',
        title: 'Troop Strength by Source',
        bars: true,
        rows: [
            { label: '1st Guards', value: 158 },
            { label: '2nd Guards', value: 84 },
            { label: "Duke of York's", value: 59 },
            { label: 'Holland Regt.', value: 49 },
            { label: 'Garrisons', value: 150 },
            { label: 'Newly raised', value: 500 },
        ],
    },
    {
        type: 'paragraph',
        text: "The companies were armed with the typical ratio of 2:1 musket to pike, with the possible exception of the Duke of York's Regiment which was musket-only. Unusually, the companies wore the uniforms of their parent regiments, and the regimental colors reflected these origins:",
    },
    {
        type: 'quote',
        text: "Warrant to Ralph Montague, Master of the King's Great Wardrobe. To prepare two colours for each of the five companies of the King's foot guards, now sending upon an expedition to Virginia, viz., for Captain Herbert Jeffreys' company, two colours, with a crowned lion passant upon the crown; for Captain Edward Picks' company two colours, with the Royal oak crowned; for Captain John Mutlowe's company two colours, the ground blue with a red cross in a white field; for Captain Charles Middleton's company two colours, white waved with lemon, equally mixed with the red cross quite through with J. D. Y. in cipher, in gold; and for Captain William Meole's company two colours, the ground green with a red cross in a white field.",
        cite: 'Calendar of State Papers Colonial, America and West Indies, Vol. 9, 1675–76',
    },

    { type: 'heading', level: 2, text: 'Arms & Equipment', id: 'arms-equipment' },
    {
        type: 'dataList',
        title: 'Equipment Carried to Virginia',
        note: 'Ordnance manifest',
        rows: [
            { label: 'Muskets', value: 700 },
            { label: 'Pikes', value: 300 },
            { label: 'Hand Grenades', value: 1000 },
            { label: '3-pdr Field Pieces', value: 4 },
            { label: 'Mortar Pieces', value: 2 },
            { label: 'Swinefeathers', value: 1500 },
            { label: 'Hoes', value: 300 },
            { label: 'Drums', value: 15 },
            { label: 'Canvas Tents', value: 5 },
        ],
    },
    {
        type: 'paragraph',
        text: 'The 1,500 "swinefeathers" — an archaic item consisting of a 6-to-7 foot pikestaff with steel points at both ends and a hook to support a musket — were likely taken to serve as field expedient chevaux de frise obstacles. They were included in an 1678 inventory at the Middle Plantation and doubtless never saw use.',
    },

    { type: 'heading', level: 2, text: 'The Atlantic Crossing', id: 'atlantic-crossing' },
    {
        type: 'paragraph',
        text: 'Before boarding for a mid-winter Atlantic crossing, the troops were issued biscuits and cheese sufficient for three months. The expedition sailed distributed across the fleet as follows:',
    },
    {
        type: 'dataList',
        title: 'Fleet Distribution, 24 Nov 1676',
        rows: [
            { label: 'Henry and Anne', detail: 'CPT Jeffreys, LT Rouse, ENS Grymes', value: 195 },
            { label: 'Barnaby', detail: 'CPT Picts, LT Hetley, ENS Matthews', value: 116 },
            { label: 'Recovery', detail: "LT Webb + remaining Picts' co.", value: 100 },
            { label: 'William and Robert', detail: 'CPT Middleton, LTs Hobbin & Thorne', value: 167 },
            { label: 'Francis', detail: 'CPT Mutlowe, LT Troutbeck, ENS Seymour', value: 97 },
            { label: "Merchant's Consent", detail: 'LT Tonge', value: 79 },
            { label: 'Golden Lyon', detail: 'CPT Meoles, LT Sanders', value: 148 },
            { label: 'Constant', detail: 'Overflow from multiple companies', value: 192 },
        ],
        total: { label: 'Total officers and men', value: 1094 },
    },

    { type: 'heading', level: 2, text: 'Arrival in Virginia', id: 'arrival-in-virginia' },
    {
        type: 'paragraph',
        text: 'The first ship arriving at the ruins of Jamestown was the Bristol on 29 January 1677, carrying Sir John Berry and Captain Morris with seventy soldiers. The rest of the fleet arrived by 5 February. The ten-week crossing had taken a devastating toll:',
    },
    {
        type: 'quote',
        text: "In Captain Middleton's Company there was about 150 such men and officers all sick and that the like number of sick were in every other company.",
        cite: 'Commissioners to the King, June 1677',
    },
    {
        type: 'paragraph',
        text: "The Regiment was forced to rely on colonists who had barely enough to take care of themselves in the wake of Bacon's Rebellion. By February, the Regiment was headquartered at the Middle Plantation — the future site of Williamsburg — with companies distributed to the Falls of the James (future Richmond), Nansemond County, and New Kent County.",
    },
    {
        type: 'paragraph',
        text: 'On 29 May 1677, the Regiment was paraded for the ceremonial signing of peace with local tribes, at which were present the Queen of the Pamunkey, her son, the Queen of Weyanoke, the King of the Nottoways, and King of the Nansemonds.',
    },

    { type: 'heading', level: 2, text: 'Return & Dissolution', id: 'return-dissolution' },
    {
        type: 'dataList',
        title: 'Personnel Movement Tracker',
        rows: [
            { label: 'Nov 1676', detail: 'Expedition departs England', value: '1,094' },
            { label: 'Jan 1678', detail: 'Unity returns to Gravesend — LT Rous (76), CPT Mutlowe (67), CPT Picts (74)', value: '−220' },
            { label: 'Apr 1678', detail: "LT Collier's group returns to England", value: '−155' },
            { label: '1678', detail: "Jeffreys' Company remains in Virginia (20 men from each co.)", value: '100' },
            { label: 'Sep 1679', detail: "Culpepper's Company arrives from England", value: '+~100' },
            { label: 'Jun 1682', detail: 'Both companies disbanded; 8 retained as Governor\'s Guard', value: '−all' },
        ],
    },
    {
        type: 'callout',
        variant: 'insight',
        title: 'An Open Question',
        text: "A total of 375 soldiers returned to England out of Jeffreys' Regiment. Excluding the 100 who remained in service, that means 525 soldiers either died or chose to stay in Virginia as civilians. It is interesting that the Unity returned primarily with soldiers from the 1st and 2nd Guards. Could those who stayed have been predominantly from the Duke of York's Regiment and the Holland Regiment?",
    },
    {
        type: 'paragraph',
        text: 'Colonel Jeffreys died in December 1678. Sir Henry Chicheley replaced him as Lieutenant Governor and Captain. By 1680, the Virginia Assembly asked that soldiers replace militia at four garrison houses on the Rappahannock, Potomac, James and Mattaponi Rivers — but 38 of those 40 soldiers were described as mutinous, likely due to lack of pay.',
    },
    {
        type: 'paragraph',
        text: 'The end came in May 1682. The cutting of tobacco plants while still in the fields — a desperate effort to raise prices — occurred simultaneously with the disbandment. The soldiers, unsatisfied with terms, only contributed to the problem they could have helped quell:',
    },
    {
        type: 'quote',
        text: 'They are therefore so far from being an assistance at the only moment they are wanted since their arrival, that their mutinous temper doubles our apprehension of evil events.',
        cite: 'Secretary of Virginia to Sir Leoline Jenkins, 1682',
    },
    {
        type: 'paragraph',
        text: "The disbandment was complete by June 1682. Arms, partisans, halberds and drums were returned to store. Eight soldiers were retained as the Governor's Guard. James Archer, the engineer, appears in the record as late as 1690 as a Captain in the Virginia Militia — one of the few traceable threads of the regiment's legacy.",
    },

    { type: 'heading', level: 2, text: 'Conclusions', id: 'conclusions' },
    {
        type: 'paragraph',
        text: "Given the absence of military action, it is difficult to assess the contribution of Jeffreys' Regiment. Their contribution may have been preemptive — perhaps their presence prevented colonial unrest and Indian incursions rather than stopping them in process. A few officers' names reoccur in positions of colonial responsibility, so they continued to influence events.",
    },
    {
        type: 'paragraph',
        text: 'The Regiment was unique in retaining parent-unit colors and uniforms, and in the speed of its formation. It represents one of the first examples of sending British Regulars to colonies to assert Crown control over territories that had largely been ignored — a pattern that would define the next century of British colonial policy.',
    },
    {
        type: 'paragraph',
        text: 'The record remains frustratingly incomplete. Large gaps in time exist for which no information about the units has been found. Any insights or sources that would help make a more complete record would be greatly appreciated.',
    },
]

export const virginiaSources: string[] = [
    'Cannon, Richard, "Historical Record of the British Army, the Third Regiment of Foot," London, 1837',
    'Hamilton, F.W., "The Origins and History of the First or Grenadier Guards," Vol. I, London, 1874',
    'Hening, William, "The Statutes at Large," Vol. II, 1660–82, New York, 1823',
    'Knight, H.R., "Historical Record of the Buffs," Vol. I, London, 1905',
    'Lustig, Mary, "The Imperial Executive in America, Sir Edmund Andros," New Jersey, 2002',
    'McKinnon, Col., "Origin and Services of the Coldstream Guards," Vol. II, 1833',
    'Oberg, Michael, ed., "Samuel Wiseman\'s Book of Record," Lexington Books, 2005',
    'Tisdale, D.A., "Soldiers of the Virginia Colony, 1607–1699," 2000',
    'Webb, Stephen, "1676 The End of American Independence," Syracuse, 1995',
    '"Calendar of State Papers Colonial, America and West Indies," Vols. 9–11',
    '"Calendar of State Papers Domestic: Charles II," 1676–81',
]

export const irelandBody: RichText = [
    {
        type: 'callout',
        variant: 'reading',
        text: 'This is a long-form research article (~12,000 words). Use the table of contents to navigate between sections, or read straight through. Estimated reading time: 45 minutes.',
    },
    { type: 'heading', level: 2, text: 'Background', id: 'background' },
    { type: 'heading', level: 3, text: 'The Irish', id: 'the-irish' },
    {
        type: 'paragraph',
        text: 'Ireland has been home to native Irish, Scots and English since the 12th century. The native Irish, referred to as "mere Irish" by the English, lived for the most part under the rule of a local chief or noble. The succession for the noble class was not assured a smooth transition so there were numerous struggles and conflicts with associated shifting alliances and no central ruler.',
    },
    {
        type: 'paragraph',
        text: 'A relatively primitive form of agriculture and a semi-nomadic pastoral life following herds of cattle characterized the means of production in late medieval native Ireland with trade becoming more important in the early modern period. The native Irish retained their unique form of Catholicism that permitted divorce, trial marriage and married clergy after the Reformation and from the mid 16th century on looked to Spain and France for trade, clergy, and military assistance.',
    },
    { type: 'heading', level: 3, text: 'The Old English', id: 'the-old-english' },
    {
        type: 'paragraph',
        text: 'The first Anglo-Norman settlements were established on the east coast in the 12th century and were militarily important to early England in order to control the sea which separated England and Ireland. As time went on, the English involved the Irish in their internal politics and continental adventures, occupying more and more land in an effort to civilize Ireland that did not include assimilation of the native Irish but rather insured their isolation.',
    },
    {
        type: 'paragraph',
        text: 'The English who settled in Ireland were seen as more Irish and less English by those who remained in England. The English Protestant Reformation and the consequent inclination of the English in Ireland to remain Catholics only increased this division. These, then, were known as the "Old English."',
    },
    { type: 'heading', level: 3, text: 'The Antrim Scots', id: 'the-antrim-scots' },
    {
        type: 'paragraph',
        text: 'Scottish mercenaries had served Irish nobles for several hundred years before they began to settle in Antrim in the 15th century. These were the "redshanks" of Clan Donald who were able to retain their lands in northern Antrim after the Lordship of the Western Isles was broken by Scotland in the 16th century.',
    },
    {
        type: 'paragraph',
        text: 'The shared Catholicism of the native Irish, Old English and Antrim Scots created a strong basis for political and military cooperation.',
    },
    { type: 'heading', level: 3, text: 'The New English & New Scots', id: 'new-english-new-scots' },
    {
        type: 'paragraph',
        text: 'The Desmond rebellion, 1579–83, was seen by many English soldiers and administrators familiar with Ireland as a chance to acquire large tracts of land at the expense of the Irish rebels, even before the rebels were defeated. The Desmond rebellion was also the first time the Papacy and Spain took an active role in supporting the Irish and Old English.',
    },
    {
        type: 'paragraph',
        text: 'With the establishment of the Plantation of Munster, large numbers of English Protestant settlers began arriving at the end of the 16th century. The establishment of the Ulster plantation in 1610 resulted in large numbers of English and Scots settling in west and central Ulster.',
    },

    { type: 'heading', level: 2, text: '1633–1641: The Buildup', id: 'buildup' },
    {
        type: 'paragraph',
        text: "The already tense situation in Ireland was exacerbated when Charles I's Lord Deputy, Thomas Wentworth, arrived in Dublin in 1633 with the objectives of increasing Crown revenue, reducing the influence of Catholics and enforcing religious conformity on the Protestants — all goals bound to increase disaffection in every part of Irish society.",
    },
    {
        type: 'paragraph',
        text: 'The dissolution of the Irish Parliament in August of 1641 on the verge of approving the Graces after numerous attempts in previous Irish Parliaments made it clear that there was no intention on the part of the English administration to ever approve them.',
    },

    { type: 'heading', level: 2, text: '1641: The Rebellion', id: 'rebellion' },
    {
        type: 'paragraph',
        text: 'The events of October 1641 in Ireland have been described as a "rising" or "rebellion" depending on the author\'s bias and perspective on the legitimacy of the event. The original conspiracy foresaw a rapid takeover of the government with Dublin Castle, the seat of English power, as a primary target.',
    },
    {
        type: 'paragraph',
        text: "A drinking bout in Dublin resulted in discovery of the attempt to be made on Dublin Castle and its subsequent failure on 22 October 1641. On the 23rd, Sir Philem O'Neil captured Charlemont and Dungannon. Within a few days the rebels controlled much of Ulster with the exception of Antrim, Carrickfergus, northern Down, Londonderry, Enniskillen and some isolated castles and forts.",
    },
    {
        type: 'paragraph',
        text: 'The solution was found in the Scottish Army of the Solemn League. Led, and in many cases manned, by veterans of the 30 Years War and 80 Years War on the continent, it was a brutal force.',
    },
    {
        type: 'collapsible',
        title: 'Detailed Events of Late 1641',
        blocks: [
            {
                type: 'paragraph',
                text: 'By late November the threat from the rebels was sufficient to cause two columns to be sent out from Dublin. One was sent under the command of Sergeant Major Roper to reinforce Drogheda which was ambushed and routed at Julianstown bridge despite warnings that the enemy was near.',
            },
            {
                type: 'paragraph',
                text: "The expedition to Wicklow led by Sir Charles Coote garrisoned New Castle and relieved Wicklow Castle, with brutal force. The Government's loss at Julianstown, brutal victory at Wicklow and unwillingness to negotiate on the rights of Catholics led those remaining Old English Catholic and Irish into supporting the rebellion, in many cases reluctantly.",
            },
            {
                type: 'paragraph',
                text: 'In an effort to relieve the pressure on besieged Drogheda, Sir Charles Coote, the Mayor of Dublin, was killed while routing rebels at Swords and Captain Armstrong scattered a rebel encampment at Rathcoole in December.',
            },
        ],
    },

    { type: 'heading', level: 2, text: '1642', id: '1642' },
    {
        type: 'paragraph',
        text: "The government's first major expedition took place on 1–3 February with the unopposed burning of Newcastle and plunder of Naas. The Scots Army of Ulster, paid for by the English Parliament, landed at Carrickfergus on 3 April and held its first muster on 7 April.",
    },
    {
        type: 'paragraph',
        text: 'The Scottish expedition sent to Ireland was initially led by Alexander Leslie, a former General in the Swedish Army, who soon departed leaving it in the hands of Sir Robert Monro, past commander of the Swedish Green Brigade and a veteran of 10 years service on the Continent.',
    },
    {
        type: 'paragraph',
        text: 'On 7 July the Irish Catholic Confederation met at Kilkenny electing a General Assembly and Supreme Council. All members took an oath of allegiance to Charles I and to uphold Catholicism.',
    },
    {
        type: 'paragraph',
        text: 'On August 22, 1642, Charles I raised his standard and began the First Civil War. The impact on the Army of Ulster was an immediate halt of supplies from Parliament.',
    },

    { type: 'heading', level: 2, text: '1643', id: '1643' },
    {
        type: 'paragraph',
        text: 'In March, Ormond and Monck moved south to clear Wicklow and Wexford of Confederation forces. In April, the offensive capability of the Confederation forces was enhanced by the arrival of heavy siege artillery, courtesy of Spain and large subsidies from the Pope.',
    },
    {
        type: 'paragraph',
        text: "By September 1643 a year's cessation of arms between Royalists under Ormond and Irish Confederation was agreed to and signed. The Cessation was not recognized by Scots Army and by most of the Ulster Protestants.",
    },

    { type: 'heading', level: 2, text: '1644', id: '1644' },
    {
        type: 'paragraph',
        text: 'The cessation created an opportunity for both Ormond and the Catholic Earl of Antrim to reinforce Royalist forces in Scotland and England. In 1644 Ormond sent regiments to Bristol and Chester, which were destroyed at Naseby and Langport. The Earl of Antrim sent three regiments of Irish mercenaries to support the Marquis of Montrose in Scotland.',
    },

    { type: 'heading', level: 2, text: '1645', id: '1645' },
    {
        type: 'paragraph',
        text: 'November of 1645 saw the arrival of the Papal Nuncio Rinuccini with arms, ammunition and Papal financial support for the Confederation as well as instructions to expel all Protestants from Ireland and establish the primacy of the Catholic Church.',
    },

    { type: 'heading', level: 2, text: '1646: The Battle of Benburb', id: 'benburb' },
    {
        type: 'paragraph',
        text: "Monro became aware of O'Neil's force on the 4th of June as he crossed the Bann. O'Neil established a position at Benburb, a river crossing site on the Blackwater. Monro attacked O'Neil's left flank late in the day but the attack stalled.",
    },
    {
        type: 'paragraph',
        text: "A standoff of at least two hours occurred until the Irish counter attacked, eventually breaking and pursuing Monro's force. Monro lost his siege train and baggage train to the rebels and perhaps as many as one in three of his men. From this point on, the Army of Ulster was reduced to a force only able to garrison Carrickfergus and Coleraine, lacking an offensive capability.",
    },

    { type: 'heading', level: 2, text: '1647', id: '1647' },
    {
        type: 'paragraph',
        text: 'On 7 June 1647 Colonel Michael Jones and regiments of the New Model Army arrived in Ireland. On the 19th of June Ormond turned Dublin over to Parliament and departed Ireland for France and exile.',
    },

    { type: 'heading', level: 2, text: '1648', id: '1648' },
    {
        type: 'paragraph',
        text: 'In May the Scottish Parliament voted in favor of war with Parliamentarian England. Robert Monro sent elements of his forces under the command of his nephew George Monro to reinforce the Duke of Hamilton and "the Engagers." The Engager army, having invaded England, was destroyed at Preston in August.',
    },
    {
        type: 'paragraph',
        text: 'In September 1648 the remnants of the Army of Ulster refused to surrender Carrickfergus, Coleraine and Belfast. Carrickfergus was taken by treachery with Sir George Monro thrown in the Tower by Monck. The Scottish Army of Ulster was disbanded shortly thereafter.',
    },

    { type: 'heading', level: 2, text: 'Aftermath', id: 'aftermath' },
    {
        type: 'paragraph',
        text: "On 30 January 1649 Charles I was executed. In August of 1649, Ormond was threatening Dublin when he was surprised and defeated at Rathmines by Jones. This defeat set the stage for Cromwell's arrival with overwhelming force to eliminate all military opposition to the Parliamentarians in Ireland.",
    },

    { type: 'heading', level: 2, text: 'Operational Conditions', id: 'operational-conditions' },
    {
        type: 'paragraph',
        text: 'The conditions in which all the armies in Ireland operated had a direct, and usually adverse, impact on the conduct of military operations. The inability of the local agriculture and industry to support the arming, massing and movement of large formations forced all armies to rely on support external to Ireland.',
    },
    {
        type: 'paragraph',
        text: "It was not until Cromwell's campaign that the logistical and movement obstacles to military operations in Ireland were overcome. Cromwell used all the port facilities under his control to rearm, refit and re-supply his forces in Ireland.",
    },

    { type: 'heading', level: 2, text: 'Significance of the Army of Ulster', id: 'significance' },
    {
        type: 'paragraph',
        text: 'The immediate effect of the arrival of the Scottish army of Ulster was the stabilization of Antrim and Down and the prevention of further rebel action there. The Army of Ulster was responsible for reinforcing the already considerable Scottish cultural foothold in Ulster by establishing first Irish Presbytery in 1641.',
    },

    { type: 'heading', level: 2, text: 'Role of Women', id: 'role-of-women' },
    {
        type: 'paragraph',
        text: 'At no time and in none of the cultures present in Ireland were women able to hold elective or appointed office. This did not however rule out the possibility of influencing events and people. In the Scots Presbyterian community, women and men were viewed as equal in household matters. Women were literate and expected to teach their children to read and wielded considerable influence in social and religious matters.',
    },

    { type: 'heading', level: 2, text: 'Catholic Confederation Armies', id: 'confederation-armies' },
    {
        type: 'paragraph',
        text: 'Initially the forces of the Irish rebellion were local levies raised by local nobility. Unity of command in military operations was absolutely critical — and this was lacking in the strategic command structure of Confederation forces, characterized by infighting and dissention at the highest levels.',
    },

    { type: 'heading', level: 2, text: 'Scottish Regiments (Army of Ulster)', id: 'scottish-regiments' },
    {
        type: 'factCards',
        cards: [
            {
                title: "Marquis of Argyle's Regiment",
                meta: 'Yellow saltire on black background',
                rows: [{ label: 'Service', value: 'Ireland 1642–1644, 1645–1648 · Scotland 1644' }],
                text: "1642 — Invasion of Rathlin Island. Garrisoned at Dunluce Castle, Ballycastle, Ballymoney. 1644 — Expedition to Leinster, then Scotland. 1645 — Sent contingent to Scotland under Col Robert Home. 1648 — Commander and Major cashiered for opposition to Engagement. Disbanded by Monck after Robert Monro's capture.",
            },
            {
                title: "Sir Mungo Campbell of Lawer's Regiment",
                meta: 'White saltire on blue background',
                rows: [{ label: 'Service', value: 'Ireland 1642 – March 1644' }],
                text: '1642 — Coleraine Expedition. Garrisoned in the Coleraine area through its service in Ireland.',
            },
        ],
    },
]

// designs/eighty-years-war-timeline-redesign.html: background and the first two periods of the timeline
export const eightyYearsWarBody: RichText = [
    {
        type: 'callout',
        variant: 'reading',
        text: 'This article uses a visual timeline format. Events are color-coded by type. Use the contents list to jump between periods, or collapse a period to skim.',
    },
    { type: 'heading', level: 2, text: 'Background', id: 'background' },
    {
        type: 'paragraph',
        text: 'As a result of wars, marriages and political maneuvering, most of the region currently known as Belgium and The Netherlands were in the hands of the Dukes of Burgundy. Charles V, the Holy Roman Emperor, was the ruler of this region by 1515. By the mid 16th century the Hapsburg-controlled Netherlands was comprised of 3 million people with 300 cities in 17 provinces — the southern three Walloon speaking and the northern 14 speaking Dutch.',
    },
    {
        type: 'paragraph',
        text: 'Antwerp was one of the economic centers of Europe and the place from which gold bullion from the New World was exchanged. The Hapsburg-Valois Wars with France ended in 1559, making the movement of people and ideas easier in Western Europe. One of the ideas on the move was Calvinist Protestantism out of Geneva — and it found particular support among the numerous lower class, lesser noble and townsfolk in the Netherlands.',
    },
    { type: 'heading', level: 2, text: 'Chronological Timeline', id: 'timeline' },
    {
        type: 'timeline',
        groups: [
            {
                label: '1555–1567',
                title: 'Gathering Storm',
                events: [
                    { kind: 'political', date: 'October 1555', title: 'Charles V Abdicates', text: 'Emperor Charles V, a Burgundian who spoke Flemish, abdicates and the Hapsburg Empire is divided — Spain and the Netherlands pass to his son Phillip II.' },
                    { kind: 'quote', text: '"The Spaniards seem wise, and are madmen; the French seem madmen, and are wise."', cite: 'Charles V' },
                    { date: '1555', text: 'Phillip II appoints William of Orange as provincial governor (Stadthouder) of Holland, Utrecht and Zeeland. The Count of Egmont was appointed Stadthouder of Flanders and Artois.' },
                    { kind: 'battle', date: '10 August 1557', title: 'Battle of Saint Quentin', text: 'French relief column routed by cavalry force under command of Count Egmont during the joint Hapsburg-English siege. The city was sacked on 28 August by Hapsburg-English forces.' },
                    { date: '1558', text: 'William of Orange persuades the States-General to grant Phillip II a 9-year subsidy in exchange for the granting of liberties and removal of 3,000 Spanish mercenaries.' },
                    { kind: 'treaty', date: 'June 1559', title: 'Treaty of Cateau-Cambrésis', text: 'Peace between France and Hapsburgs ends the Italian Wars and opens Western Europe to the free movement of ideas — including Calvinist Protestantism.' },
                    { date: '7 August 1559', text: "Phillip II's last visit to the Netherlands. Margaret of Parma appointed Regent. Antoine Granvelle appointed President of the Council of State." },
                    { date: '1559–1565', text: 'Steady increase of Calvinist influence from the German States and France into the Netherlands. Spanish troops depart in 1561. Granvelle appointed Primate of the Church of the Netherlands in 1562.' },
                    { kind: 'political', date: 'November 1565', title: 'Council of State Resignations', text: 'William of Orange, Count of Horn, and Lamoral of Egmont resign from the Council of State over persecution of Protestants and loss of influence over selection of Bishops.' },
                    { date: 'Spring 1566 – Spring 1567', title: 'Annus Mirabilis', text: 'Louis of Nassau and Count Brederode present the Compromise of Breda to Margaret of Parma requesting suspension of the Edict of Blood and Inquisition. The Iconoclast Fury (beeldenstorm) results in the defacing of Catholic Churches throughout the Netherlands.' },
                    { kind: 'battle', date: '13 March 1567', title: 'Battle of Oosterweel', text: 'Calvinist rebel "Beggar" army (geuzen leger) defeated — the first military engagement of the revolt.' },
                    { kind: 'political', date: '22 August 1567', title: 'Duke of Alba Arrives', text: 'Duke of Alba arrives in Brussels with an army of 9,000 to quell unrest. He establishes the "Council of Troubles" (Council of Blood) — by 1573, 12,000 cases tried, 1,000 executions, 9,000 confiscations.' },
                    { date: '9 September 1567', text: 'Arrest of Egmont, general and former companion to Alba and Phillip II, along with his fellow Protestant sympathizer Horn. Approximately 60,000 flee the Netherlands for neighboring German states and England.' },
                ],
            },
            {
                label: '1568–1573',
                title: 'Open Revolt',
                collapsed: true,
                events: [
                    { kind: 'battle', date: '23 May 1568', title: 'Battle of Heiligerlee', text: 'German rebel force of 2,500 horse and 7,000 foot under Louis of Nassau defeats the army of the Count of Aremberg near Groningen — the first rebel military victory.' },
                    { kind: 'quote', text: '"Nunc aut nunquam, Recuperare aut mori" — Freedom for the Fatherland and conscience.', cite: "Inscription on Louis of Nassau's colors" },
                    { date: '5 June 1568', title: 'Egmont and Horn Executed', text: 'Egmont and Horn are executed for high treason in Brussels, turning them into martyrs for the revolt.' },
                    { kind: 'battle', date: '21 July 1568', title: 'Battle of Jemmingen', text: 'Rebel and Huguenot force under Prince Louis of Nassau routed along the river Ems. Count Adolf of Nassau killed. A devastating reversal after Heiligerlee.' },
                    { date: 'February 1569', text: 'William of Orange gives Sea Beggars their first Letters of Commission. They are based in Emden, La Rochelle (a Huguenot-controlled port in France), and Dover in England.' },
                    { kind: 'political', date: 'March 1569', title: 'The Tenth Penny Tax', text: 'Duke of Alba forces the States-General to enact a ruinous 10% sales tax and 5% property tax to fund an army he — not the States-General — would control.' },
                ],
            },
        ],
    },
]

// designs/hussites-redesign.html has image placeholders with these captions; the images don't exist yet
export const hussitesFigures: RichText = [
    { type: 'figure', alt: 'Hussite Battle Flags', caption: 'Hussite Battle Flags' },
    { type: 'figure', alt: 'Portrait of Jan Hus', caption: 'Jan Hus', aspect: 'portrait' },
]
