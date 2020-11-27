<script lang="ts">
  import Avatars from "@dicebear/avatars";
  import sprites from "@dicebear/avatars-avataaars-sprites";

  interface Avataaar {
    seed: string;
  }

  export let mapping: Avataaar;

  let avatars = new Avatars(sprites);
  let svg = avatars.create(mapping.seed, { radius: 100 });
</script>

{@html svg}
