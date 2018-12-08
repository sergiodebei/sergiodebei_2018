<?php

    add_image_size('slider', 1400, 586, true);
    add_image_size('column', 437, 350, true);
    // add_image_size('event', 130, 130, true);
    // add_image_size('lightbox-preview-hor', 300, 225, true);
    // add_image_size('lightbox-preview-ver', 225, 300, true);

    // register_taxonomy( 'project-cat', array( 'projects' ), array(
    //     'labels' => array(
    //         'name'                         => 'Projects Categories',
    //         'singular_name'                => 'Project Category',
    //         'menu_name'                    => 'Projects Categories'
    //     ),
    //     'hierarchical'        => true,
    //     'show_ui'             => true,
    //     'show_admin_column'   => true,
    //     'query_var'           => true,
    //     )
    // );

    // function get_first_paragraph(){
    //     global $post;   
    //     $str = wpautop( get_the_content() );
    //     $str = substr( $str, 0, strpos( $str, '</p>' ) + 4 );
    //     $str = strip_tags($str, '<a><strong><em>');
    //     return '<p>' . $str . '</p>';
    // }
  
// Setup theme with Timber

// Check if Timber plugin is active and prompts an error if not
if ( ! class_exists( 'Timber' ) ) {
    add_action( 'admin_notices', function() {
        echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
    } );
    return;
}
  
// Check if Advanced Custom Fields plugin is active and prompts an error if not
if ( ! class_exists('acf')) {
    add_action( 'admin_notices', function() {
        echo '<div class="error"><p>Advanced Custom Fields not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
    } );
    return;
}
  
// Set location for the twig files
Timber::$dirname = array('views');

class StarterSite extends TimberSite {

  function __construct() {
    if ( WP_DEBUG ) {
      add_filter( 'timber/cache/mode', function () {
        return 'none';
      });
    }

    // define('BASEURL', WP_HOME);

    add_action( 'init', array($this, 'add_menu_support') );
    add_action( 'init', array($this, 'register_my_menus') );
    add_action( 'init', array($this, 'add_thumbnails_support') );
    // add_action( 'init', array($this, 'remove_meta_boxes') );
    // add_action( 'init', array($this, 'enqueue_styles'));
    // add_action( 'init', array($this, 'enqueue_scripts'));
    add_filter( 'timber_context', array( $this, 'add_to_context' ) );
    // add_action( 'admin_init', array($this, 'post_remove'));
    // add_action( 'init', array( $this, 'register_post_types' ) );
    // add_action( 'init', array( $this, 'register_taxonomies' ) );
    // add_action( 'init', array($this, 'option_page') );
    // add_action( 'after_setup_theme', array($this, 'register_image_sizes'));
    // add_filter( 'tiny_mce_before_init', array( $this, 'wptiny' ) );
    add_filter( 'show_admin_bar', array( $this, 'my_function_admin_bar' ) );
    // add_filter( 'upload_mimes', array( $this, 'cc_mime_types' ) );
    // add_filter( 'posts_search', 'advanced_custom_search', 500, 2 );
    parent::__construct();
  }

	// Add menu support
	function add_menu_support(){
		add_theme_support( 'menus' );
    }
    
	// Register the names of the menus
	function register_my_menus() {
		register_nav_menus(
			array(
            'primary-menu' => __( 'Primary menu' ),
			)
		);
    } 
    
    // Add Featured image support
	function add_thumbnails_support(){
		add_theme_support( 'post-thumbnails' );
	}

	//TODO doesnt work
	function remove_meta_boxes() {
		remove_meta_box( 'commentsdiv', 'post', 'normal' );
	}

	//TODO doesnt work
	function post_type_support(){
		add_post_type_support( 'post', 'page-attributes' );
    }

    function enqueue_styles() {
		wp_enqueue_script( 'my-css', get_template_directory_uri(). '/assets/dev/css/sergiodebei-main.css', false ); 
	}
    
    function enqueue_scripts() {
        // Update jQuery in frontend
        // if (!is_admin()) {
        //     wp_deregister_script('jquery'); // Deregister the included library
        //     wp_enqueue_script(
        //         'jquery', 'https://code.jquery.com/jquery-3.2.1.min.js',
        //         array(), '3.2.1', true
        //     );
        // }
        wp_enqueue_script( 'my-js', get_template_directory_uri(). '/assets/dev/js/sergiodebei-main.js', false );
    }

    function add_to_context( $context ) {
        $context['menu'] = new TimberMenu();
        $context['site'] = $this;
        // $context['site']->url = BASEURL . '';
        $context['site']->assets = './assets/';
        $context['site']->is_home = is_front_page();
        // $context['options'] = get_fields('options');
        return $context;
    }

    function post_remove(){
        // remove_menu_page( 'index.php' );                  //Dashboard
        // remove_menu_page( 'jetpack' );                    //Jetpack* 
        remove_menu_page( 'edit.php' );                   //Posts
        // remove_menu_page( 'upload.php' );                 //Media
        // remove_menu_page( 'edit.php?post_type=page' );    //Pages
        remove_menu_page( 'edit-comments.php' );          //Comments
        // remove_menu_page( 'themes.php' );                 //Appearance
        // remove_menu_page( 'plugins.php' );                //Plugins
        // remove_menu_page( 'users.php' );                  //Users
        // remove_menu_page( 'tools.php' );                  //Tools
        // remove_menu_page( 'options-general.php' );        //Settings
    }

    // Register Custom Post Type
    function register_post_types() {
        register_post_type( 'projects', array(
            'labels' => array(
            'name' => __( 'Projects' ),
            'singular_name' => __( 'Project' ),
            'menu_name' => 'Projects'
        ),
        'menu_position' => 10,
        'menu_icon' => 'dashicons-welcome-view-site',
        'hierarchical' => false,
        'public' => true,
        'show_ui' => true,
        'publicly_queryable' => true,
        'has_archive' => true,
        'show_in_nav_menus' => true,
        'exclude_from_search' => false,
        // 'rewrite' => array('slug' => 'agenda'),
        // 'taxonomies' => 'array('category')',
        'supports' => array('revisions', 'title','menu_order', 'page-attributes')
        )
    );

  	// Register Custom Taxonomy
  	function register_taxonomies() {
        register_taxonomy( 'project-cat', array( 'projects' ), array(
            'labels' => array(
                'name'                         => 'Projects Categories',
                'singular_name'                => 'Project Category',
                'menu_name'                    => 'Projects Categories'
            ),
            'hierarchical'        => true,
            'show_ui'             => true,
            'show_admin_column'   => true,
            'query_var'           => true,
            )
        );
    }
    
    // Setup option pages
    function option_page() {
        acf_add_options_page(
            array(
                'page_title'    => 'Options',
                'menu_title'    => 'Options',
                'menu_slug'     => 'project-options',
                'capability'    => 'edit_posts',
                'redirect'      => false
            )
        );
    }
    
    // Register a new image size.
    // add_image_size( string $name, int $width, int $height, bool|array $crop = false )
    // ex. add_image_size( 'custom-size', 220, 180, false );
    // If false (default), images will be scaled, not cropped.
    // If true, images will be cropped to the specified dimensions using center positions.
    //Activate YoImages plugin to edit sizes that are set on true
    function register_image_sizes(){
        // Defined in CMS
        // thumbnail    - 150, 150, true
        // medium       - 300, 300, false
        // large        - 1024, 1024, false
    
        // Additional sizes
        // FORCE CROP
        add_image_size('slider', 1400, 586, true);
        add_image_size('column', 437, 350, true);
        add_image_size('event', 130, 130, true);
        add_image_size('lightbox-preview-hor', 300, 225, true);
        add_image_size('lightbox-preview-ver', 225, 300, true);
    
        // NO CROP
        // add_image_size('poster', 1000, 500, false);
        // add_image_size('content', 1000, 1000, false);
    }
    
	// Set wysiwyg editor height
	function wptiny($initArray){
		$initArray['height'] = '150px';
		return $initArray;
	}

	// Hide the adminbar for the front side of the website
	function my_function_admin_bar(){ 
		return false; 
	}

	// Add svg image support
	function cc_mime_types($mimes) {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
    }
    
    /**
	 * [advanced_custom_search search that encompasses ACF/advanced custom fields and taxonomies and split expression before request]
	 * @param  [query-part/string]      $where    [the initial "where" part of the search query]
	 * @param  [object]                 $wp_query []
	 * @return [query-part/string]      $where    [the "where" part of the search query as we customized]
	 * see https://vzurczak.wordpress.com/2013/06/15/extend-the-default-wordpress-search/
	 * credits to Vincent Zurczak for the base query structure/spliting tags section
	 */
	function advanced_custom_search( $where, $wp_query ) {
		global $wpdb;

		if ( empty( $where ))
			return $where;

		// get search expression
		$terms = $wp_query->query_vars[ 's' ];

		// explode search expression to get search terms
		$exploded = explode( ' ', $terms );
		if( $exploded === FALSE || count( $exploded ) == 0 )
			$exploded = array( 0 => $terms );

		// reset search in order to rebuilt it as we whish
		$where = '';

		// get searcheable_acf, a list of advanced custom fields you want to search content in
		$list_searcheable_acf = list_searcheable_acf();
		// foreach( $exploded as $tag ) :
			$where .= "
			AND (
				(f_cms_posts.post_title LIKE '%$terms%')
				OR (f_cms_posts.post_content LIKE '%$terms%')
				OR EXISTS (
				SELECT * FROM f_cms_postmeta
					WHERE post_id = f_cms_posts.ID
						AND (";
			foreach ($list_searcheable_acf as $searcheable_acf) :
			if ($searcheable_acf == $list_searcheable_acf[0]):
				$where .= " (meta_key LIKE '%" . $searcheable_acf . "%' AND meta_value LIKE '%$terms%') ";
			else :
				$where .= " OR (meta_key LIKE '%" . $searcheable_acf . "%' AND meta_value LIKE '%$terms%') ";
			endif;
			endforeach;
				$where .= ")
				)
				OR EXISTS (
				SELECT * FROM f_cms_comments
				WHERE comment_post_ID = f_cms_posts.ID
					AND comment_content LIKE '%$terms%'
				)
				OR EXISTS (
				SELECT * FROM f_cms_terms
				INNER JOIN f_cms_term_taxonomy
					ON f_cms_term_taxonomy.term_id = f_cms_terms.term_id
				INNER JOIN f_cms_term_relationships
					ON f_cms_term_relationships.term_taxonomy_id = f_cms_term_taxonomy.term_taxonomy_id
				WHERE (
					taxonomy = 'post_tag'
						OR taxonomy = 'category'
					)
					AND object_id = f_cms_posts.ID
					AND f_cms_terms.name LIKE '%$terms%'
				)
			)";
		// endforeach;
		return $where;
	}


  }

}
/* functions.php */
if (class_exists('Timber')){
    Timber::$cache = false;
}

new StarterSite();
