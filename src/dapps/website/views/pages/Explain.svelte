<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "./../molecules/Header.svelte";
  import Chart from "svelte-frappe-charts";
  import { chartMonetaryMass } from "../../data/chartMonetaryMass";
  import { chartCirclesVsOTime } from "../../data/chartCirclesVsOTime";
  import { chartHoursAlive1Week } from "../../data/chartHoursAlive1Week";
  import { chartOTimeGrowth100Years } from "../../data/chartOTimeGrowth100Years";
  import { chartHoursAliveMinusDecayOver1Year } from "../../data/chartHoursAliveMinusDecayOver1Year";
  import { chartHoursAliveMinusDecayOver10Years } from "../../data/chartHoursAliveMinusDecayOver10Years";
  import { chartHoursAlive1WeekPlusOMoney } from "../../data/chartHoursAlive1WeekPlusOMoney";
  import Title from "../atoms/Title.svelte";
</script>

<Header />
<Compose rows="1fr" columns="1fr" tw="w-full max-w-6xl mx-auto">
  <Compose
    rows="1fr"
    columns="1fr"
    tw="bg-white w-full md:border md:border-light-200 md:rounded-xl"
    overflowY>
    <div class="p-8 md:p-16">
      <div class="text-4xl font-bold text-primary">Introduction</div>
      <div class="py-4 text-gray-600 text">
        ...coming soon... (intro into the current central bank dept top down
        money vs the decentralized credit based bottom up money)
      </div>
    </div>
    <div class="p-8 md:p-16">
      <Title
        mapping={{ data: { title: 'A new generation of personal moneys' } }} />

      <div class="py-4 text-gray-600 text">
        On Omo Earth every Omo Sapien is creating and using their own personal
        currency. OmoAlice has her own AliceMoney, OmoBob has his own BobMoney
        and OmoCarol has his own CarolMoney. Because OmoAlice knows and accepts
        BobMoney and CarolMoney, OmoAlice can equally interchange with OmoBob
        and OmoCarol their personal moneys to trade for goods and services.
      </div>
    </div>
    <img src="./illustrations/explain/trust.png" alt="trust" />

    <div class="p-8 md:p-16">
      <Title
        mapping={{ data: { title: 'Transacting with Omo strangers you dont know' } }} />

      <div class="py-4 text-gray-600 text">
        You might now think, but how can I use my money with Omo's I am not
        conneced to? When a new OmoDave, who doesn't know OmoBob, wants to buy
        something from OmoBob he can use his web of trust. His DaveMoney will
        travel in the background to OmoCarol. OmoCarol will keep the DaveMoney
        and transfers his CarolMoney to OmoAlice. OmoAlice keeps the CarolMoney
        and transfers her AliceMoney to OmoBob. OmoBob is happy, since he
        received only money from Omo's he knows and trusts. OmoBob completes the
        transaction and is handing over to OmoDave his part of the trade deal.
      </div>
    </div>
    <img src="./illustrations/explain/weboftrust.png" alt="trust" />

    <div class="p-8 md:p-16">
      <Title mapping={{ data: { title: "What about evil fake Omo's?" } }} />

      <div class="py-4 text-gray-600 text">
        So far there are no central authorities involved that control who can
        create a new personal OmoMoney or who not. Theoretically everyone can
        make as many fake accounts as they want. But this is quite useless,
        since at all times every Omo can only receive and hold money of Omo's
        they know and trust. As you can see below, OmoAlice created a 2nd
        FakeAlice account and wants to transfer her FakeMoney to OmoBob, but
        since OmoBob only accepts AliceMoney, FakeAliceMoney will be stuck at
        OmoAlice's account, thus is completely useless.
      </div>
    </div>
    <img src="./illustrations/explain/fake.png" alt="trust" />

    <div class="p-8 md:p-16">
      <Title mapping={{ data: { title: 'The limits of web-of-trust' } }} />
      <div class="py-4 text-gray-600 text">
        When Omo's are not well connected to others they can not use their money
        properly. We can see in the following example a very happy OmoAlice, who
        is well connected and can accept and trade with plenty of different
        Omo's. On the other hand, there is OmoBob, who has only one connection
        to OmoAlice. This indeed creates a liquidity bottleneck, where OmoBob
        becomes quite isolated and lonely and is not well integrated into the
        economy, thus quickly getting frustrated.
      </div>
    </div>
    <img src="./illustrations/explain/trustlimit.png" alt="trust" />

    <div class="p-8 md:p-16">
      <Title
        mapping={{ data: { title: "Federated identification for lonely Omo's and business accounts" } }} />
      <div class="py-4 text-gray-600 text">
        ...coming soon... (explaining the federated 2nd layer identification
        with autoident algorithms and shared open source developer business
        model)
      </div>
      (placeholder illustration)
    </div>

    <div class="p-8 md:p-16">
      <div class="mt-20 text-4xl font-bold text-primary">
        Money supply and growth rates
      </div>

      <div class="py-16">
        <Title mapping={{ data: { title: 'The history of money' } }} />

        <div class="py-4 text-gray-600 text">
          In the history, money has always been connected to other references of
          value, such as seashells or gold, impersonating the role of
          representing a true store of value. Only recently in the human
          evolution, through the introduction of fiat money, the reference was
          abandoned, in favor of trying to keep economic activity, prices and
          monetary supply in balance. This resulted in a continous growth of
          money supply, inflating the total amount of debt based money, while
          silently reducing the purchasing power of the lower classes. In heavy
          crisis times people tend to loose trust in their government issued
          fiat currencies, thus even devaluating fiat even further, creating a
          run on alternative stores of values such as real estate, company
          shares or cryptocurrencies.
        </div>
      </div>
      <div class="py-16">
        <Title
          mapping={{ data: { title: 'Our clock of life, a true store of value' } }} />
        <div class="py-4 text-gray-600 text">
          To regain the characteristics of a global, decentralized and as stable
          as possible trusted store of value, Omo Sapiens found their solution
          in us humans. Our only truely valuable asset in life is our time
          alife. On Omo Earth, every Omo Sapiens clock of life is counted in
          hours. Every day 24 hours and every week 168 hours in total.
        </div>
      </div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartHoursAlive1Week.title}
        </p>
        <Chart
          data={chartHoursAlive1Week.data}
          lineOptions={chartHoursAlive1Week.design.lineOptions}
          barOptions={chartHoursAlive1Week.design.barOptions}
          axisOptions={chartHoursAlive1Week.design.axisOptions}
          colors={chartHoursAlive1Week.design.colors} />
      </div>
    </div>

    <div class="p-8 md:p-16">
      <Title mapping={{ data: { title: 'Connecting money to time' } }} />

      <div class="py-4 text-gray-600 text">
        Omo Sapiens tightly connect their money, they use to trade and barter
        goods and services, to their time alive. They call their money ⦿
        (pronounced 'o', from latin ora, with the symbol ⦿ which in many
        cultures is respresenting the sun that is providing the energy for life
        to grow). Every hour alive, every Omo Sapien is harvesting 1⦿ and over
        the course of 7 days in total 168⦿.
      </div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartHoursAlive1WeekPlusOMoney.title}
        </p>
        <Chart
          data={chartHoursAlive1WeekPlusOMoney.data}
          lineOptions={chartHoursAlive1WeekPlusOMoney.design.lineOptions}
          barOptions={chartHoursAlive1WeekPlusOMoney.design.barOptions}
          axisOptions={chartHoursAlive1WeekPlusOMoney.design.axisOptions}
          colors={chartHoursAlive1WeekPlusOMoney.design.colors} />
      </div>
    </div>

    <div class="p-8 md:p-16">
      <Title mapping={{ data: { title: 'Decay of lazy money' } }} />

      <div class="py-4 text-gray-600 text">
        Like memories are fading away over time, lazy money which you don't use
        and is just sitting in your account, will decay and fade away. Your ⦿
        money keeps on growing continouesly instead of being devaluated through
        hidden debt based money inflation. Comparing the decay rate at 7% to the
        0€, which you would have in today's money dept system, or the tendency
        that fiat currency today on your bank account will buy you less goods
        and services next year, makes ⦿ an quite attracative store of value.
      </div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartHoursAliveMinusDecayOver1Year.title}
        </p>
        <Chart
          data={chartHoursAliveMinusDecayOver1Year.data}
          lineOptions={chartHoursAliveMinusDecayOver1Year.design.lineOptions}
          barOptions={chartHoursAliveMinusDecayOver1Year.design.barOptions}
          axisOptions={chartHoursAliveMinusDecayOver1Year.design.axisOptions}
          colors={chartHoursAliveMinusDecayOver1Year.design.colors} />
      </div>
    </div>

    <div class="p-8 md:p-16">
      <Title
        mapping={{ data: { title: 'When the growth rate is higher than the decay rate' } }} />

      <div class="py-4 text-gray-600 text">
        You might now argue, that the decay rate is stil quite high and a huge
        devaluation without providing any stable store of value, but rest
        assured, especially for the lower and middle class exactly the opposite
        is true. After 10 years an Omo Sapien has been 87.600 hours alive
        harvested in total 87.600⦿. In case you have been saving all your money,
        the decay rate of 7% a year, will reduce your harvested ⦿ income to
        64.576⦿.
      </div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartHoursAliveMinusDecayOver10Years.title}
        </p>
        <Chart
          data={chartHoursAliveMinusDecayOver10Years.data}
          lineOptions={chartHoursAliveMinusDecayOver10Years.design.lineOptions}
          barOptions={chartHoursAliveMinusDecayOver10Years.design.barOptions}
          axisOptions={chartHoursAliveMinusDecayOver10Years.design.axisOptions}
          colors={chartHoursAliveMinusDecayOver10Years.design.colors} />
      </div>
    </div>

    <div class="p-8 md:p-16">
      <Title mapping={{ data: { title: 'The golden middle' } }} />

      <div class="py-4 text-gray-600 text">
        Even though the decay rate is at 7% a year, the growth rate of your time
        alive is always higher until the golden middle of around ~125.000, which
        you would own after 100 years alive, if you would always save your money
        and didn't spend any of it. Beyond owning personally 125.000⦿ through
        other economic activity and for investors, entrepreneurs and businesses,
        which can not harvest time money, the decay rate will always reduce lazy
        sitting money over time. This creates for the rich the incentive to
        continuesly keep money in the economy flowing, by either reinvesting or
        distributing the profits to teammembers. This special characteristic of
        the ⦿ money design is keeping the global gap between rich and poor at
        greater balance. The less you own, the more you harvest, the more you
        own, the higher your decay tax.
      </div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartOTimeGrowth100Years.title}
        </p>
        <Chart
          data={chartOTimeGrowth100Years.data}
          lineOptions={chartOTimeGrowth100Years.design.lineOptions}
          barOptions={chartOTimeGrowth100Years.design.barOptions}
          axisOptions={chartOTimeGrowth100Years.design.axisOptions}
          colors={chartOTimeGrowth100Years.design.colors} />
      </div>
    </div>

    <div class="p-8 md:p-16">
      <Title
        mapping={{ data: { title: 'Comparing € money supply to the ⦿ supply' } }} />

      <div class="py-4 text-gray-600 text">...coming soon...</div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartMonetaryMass.title}
        </p>
        <Chart
          data={chartMonetaryMass.data}
          lineOptions={chartMonetaryMass.design.lineOptions}
          barOptions={chartMonetaryMass.design.barOptions}
          axisOptions={chartMonetaryMass.design.axisOptions}
          colors={chartMonetaryMass.design.colors} />
      </div>
    </div>

    <div class="p-8 md:p-16">
      <Title
        mapping={{ data: { title: 'Difference between Circles (nominal units) and ⦿ money (relative units)' } }} />

      <div class="py-4 text-gray-600 text">...coming soon...</div>
      <div class="mt-4 bg-white">
        <p class="text-sm font-bold text-light-500">
          {chartCirclesVsOTime.title}
        </p>
        <Chart
          data={chartCirclesVsOTime.data}
          lineOptions={chartCirclesVsOTime.design.lineOptions}
          barOptions={chartCirclesVsOTime.design.barOptions}
          axisOptions={chartCirclesVsOTime.design.axisOptions}
          colors={chartCirclesVsOTime.design.colors} />
      </div>
    </div>
  </Compose>
</Compose>
