<script lang="ts">
  import { Layout } from "src/libs/o-types/interfaces/Layout";
  import Composite from "../atoms/Composite.svelte";
  import Leaf from "../atoms/Leaf.svelte";
  import Notifications from "../molecules/Notifications.svelte";
  import TemplateMobileWrapper from "./TemplateMobileWrapper.svelte";

  let layout: Layout = {
    areas: "'notifications''header''main'",
    columns: "1fr",
    rows: "auto 200px 1fr",
  };
</script>

<TemplateMobileWrapper>
  <Composite {layout} bg="bg-light-100">
    <Leaf area="notifications">
      <Notifications />
    </Leaf>
    <Leaf area="header" p="p-4">
      <slot name="header" />
    </Leaf>
    <Leaf area="main" p="p-4" overflowY>
      <slot name="main" />
    </Leaf>
  </Composite>
</TemplateMobileWrapper>
