<script lang="ts">
  import { Layout } from "src/libs/o-types/interfaces/Layout";
  import Composite from "../atoms/Composite.svelte";
  import Leaf from "../atoms/Leaf.svelte";
  import Notifications from "../molecules/Notifications.svelte";
  import TemplateMobileWrapper from "./TemplateMobileWrapper.svelte";

  let layout: Layout = {
    areas: "'notifications' 'balance' 'address' 'main' 'footer'",
    columns: "1fr",
    rows: "auto 160px 40px 1fr ",
  };
</script>

<TemplateMobileWrapper>
  <Composite {layout} bg="bg-light-100">
    <Leaf area="notifications">
      <Notifications />
    </Leaf>
    <Leaf area="balance">
      <slot name="balance" />
    </Leaf>
    <Leaf area="address">
      <slot name="address" />
    </Leaf>
    <Leaf area="main" overflowY>
      <slot name="main" />
    </Leaf>
  </Composite>
</TemplateMobileWrapper>
