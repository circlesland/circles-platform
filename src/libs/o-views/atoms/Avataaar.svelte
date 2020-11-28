<script lang="ts">
  import Avatars from "@dicebear/avatars";
  import sprites from "@dicebear/avatars-avataaars-sprites";
  import { Avataaar } from "./../interfaces/atoms";

  export let mapping: Avataaar;

  let avatars = new Avatars(sprites);
  let svg = avatars.create(mapping.data.seed, mapping.design);
</script>

{@html svg}
