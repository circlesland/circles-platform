<script lang="ts">
  import Avatars from "@dicebear/avatars";
  import sprites from "@dicebear/avatars-avataaars-sprites";

  interface Avataaar {
    data: {
      seed: string;
    };
    design: {
      radius: number;
    };
  }

  export let mapping: Avataaar;

  let avatars = new Avatars(sprites);
  let svg = avatars.create(mapping.data.seed, mapping.design);
</script>

{@html svg}
